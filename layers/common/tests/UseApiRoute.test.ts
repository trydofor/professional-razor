import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';

const session = 'wings-session';
const cookie = `session=${session}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

registerEndpoint('/api/v1/test-get.json', (event) => {
  const contentType = event.node.req.headers['content-type'];
  return { success: true, data: contentType ?? null };
});

registerEndpoint('/api/v1/test-post.json', (event) => {
  const contentType = event.node.req.headers['content-type'];
  return { success: true, data: contentType ?? null };
});

registerEndpoint('/api/v1/test-403.json', (event) => {
  event.node.res.statusCode = 403;
  return { error: 'Forbidden' };
});

registerEndpoint('/api/v1/test-session.json', (event) => {
  event.node.res.setHeader('Set-Cookie', cookie);
  event.node.res.setHeader('Session', session);

  return {
    success: true,
    data: cookie,
  };
});

registerEndpoint('/api/v1/test-error.json', () => {
  return {
    success: false,
    errors: [{ message: 'error' }],
  };
});

registerEndpoint('/api/v1/test-false.json', () => {
  return {
    success: false,
    message: 'false',
  };
});

describe('useApiRoute with real $fetch requests', () => {
  it('should send GET request with correct Content-Type (no body)', async () => {
    const { get, raw } = useApiRoute();
    const rs1 = await get('/test-get.json');
    logger.debug('get', JSON.stringify(rs1));
    expect(rs1.data).toEqual('application/json');
    const rs2 = await raw('/test-get.json', { method: 'get' });
    logger.debug('get', JSON.stringify(rs2));
    expect(rs2._data).toEqual({ success: true, data: 'application/json' });
  });

  it('should send POST request with JSON Content-Type', async () => {
    const { post, raw } = useApiRoute();
    const jsonBody = { key: 'value' };
    const rs1 = await post('/test-post.json', jsonBody);
    logger.debug('post JSON', JSON.stringify(rs1));
    expect(rs1.data).toBe('application/json');
    const rs2 = await raw('/test-post.json', { method: 'post', body: jsonBody });
    logger.debug('post JSON', JSON.stringify(rs2));
    expect(rs2._data).toEqual({ success: true, data: 'application/json' });
  });

  it('should send POST request with FormData Content-Type', async () => {
    const { post } = useApiRoute();
    const formData = new FormData();
    formData.append('key', 'value');

    const rs = await post('/test-post.json', formData);
    logger.debug('post FormData', JSON.stringify(rs));
    expect(rs.data).toContain('multipart/form-data');
  });

  it('should send POST request with URLSearchParams Content-Type', async () => {
    const { post } = useApiRoute();
    const params = new URLSearchParams();
    params.append('key', 'value');

    const rs = await post('/test-post.json', params);
    logger.debug('post SearchParams', JSON.stringify(rs));
    expect(rs.data).toContain('application/x-www-form-urlencoded');
  });

  it('should send POST request with option', async () => {
    const { post } = useApiRoute();
    const params = new URLSearchParams();
    params.append('key', 'value');

    const opt = { options: {} };
    const rs = await post('/test-post.json', params, { k1: 'v2' }, {
      onRequest: (ctx) => {
        // logger.debug('ctx', JSON.stringify(ctx));
        opt.options = JSON.stringify(ctx.options);
      },
    });
    logger.debug('post SearchParams', JSON.stringify(rs));
    logger.debug('onRequest', JSON.stringify(opt));
    expect(rs.data).toContain('application/x-www-form-urlencoded');
    expect(opt.options).toContain('"query":{"k1":"v2"}');
    expect(opt.options).toContain('"params":{"k1":"v2"}');
  });

  it('should send POST with Session Event', async () => {
    const { post } = useApiRoute();
    const eventSpy = vi.fn();

    apiResponseEventBus.on((ev) => {
      eventSpy(ev.session);
    });

    await post('/test-session.json');
    expect(eventSpy).toHaveBeenNthCalledWith(1, session);
  });

  it('should send POST with Error', async () => {
    const { post } = useApiRoute();

    await expect(post('/test-403.json')).rejects.toSatisfy((error: SafeAny) => {
      const fe = apiRouteFetchError(error);
      return fe?.status === 403;
    });

    await expect(post('/test-error.json')).rejects.toSatisfy((error: SafeAny) => {
      return error instanceof ApiResultError && error.errorResult != null;
    });

    await expect(post('/test-false.json')).rejects.toSatisfy((error: SafeAny) => {
      return error instanceof ApiResultError && error.falseResult != null;
    });
  });

  it('should send POST without FalseError', async () => {
    const { post } = useApiRoute({
      onResponse: [
        apiResponseSessionHook(),
        apiResponseStatusHook(),
        apiResponseResultHook(false),
      ],
    });

    await expect(post('/test-error.json')).rejects.toSatisfy((error: SafeAny) => {
      return error instanceof ApiResultError && error.errorResult != null;
    });

    await expect(post('/test-false.json')).resolves.toSatisfy((result: SafeAny) => {
      return result.success === false;
    });
  });
});

describe('merge options', () => {
  const op1 = {
    onRequest: () => { logger.debug('onRequest 1'); },
    onRequestError: () => { logger.debug('onRequestError 1'); },
    onResponse: () => { logger.debug('onResponse 1'); },
    onResponseError: () => { logger.debug('onResponseError 1'); },
  } as NonNullable<Parameters<typeof $fetch>[1]>;

  const op2 = {
    onRequest: () => { logger.debug('onRequest 2'); },
    onRequestError: () => { logger.debug('onRequestError 2'); },
    onResponse: () => { logger.debug('onResponse 2'); },
    onResponseError: () => { logger.debug('onResponseError 2'); },
  } as NonNullable<Parameters<typeof $fetch>[1]>;

  it('returns empty object if ops and op are null or undefined', () => {
    const { opt } = useApiRoute({});
    expect(opt()).toEqual({});
    expect(opt(op1)).toEqual(op1);
  });

  it('returns ops if op is null or undefined', () => {
    const { opt } = useApiRoute(op1);
    expect(opt()).toEqual({ ...op1 });
  });

  it('merges hooks into arrays by default when mergeHooks is null', () => {
    const { opt } = useApiRoute(op1);
    expect(opt(op2)).toEqual({
      onRequest: [op2.onRequest, op1.onRequest],
      onRequestError: [op2.onRequestError, op1.onRequestError],
      onResponse: [op2.onResponse, op1.onResponse],
      onResponseError: [op2.onResponseError, op1.onResponseError],
    });
  });

  it('overrides hooks entirely when mergeHooks is true', () => {
    const { opt } = useApiRoute(op1);
    expect(opt({ mergeFetchHooks: true, ...op2 })).toEqual(op2);
  });

  it('uses ops hooks entirely when mergeHooks is false', () => {
    const { opt } = useApiRoute(op1);
    expect(opt({ mergeFetchHooks: false, ...op2 })).toEqual(op1);
  });

  it('handles fine-grained merging based on mergeHooks object', () => {
    const op = {
      mergeFetchHooks: {
        onRequest: true,
        onRequestError: false,
        onResponse: undefined,
      },
      ...op2,
    };
    const { opt } = useApiRoute(op1);
    expect(opt(op)).toEqual({
      onRequest: op2.onRequest,
      onRequestError: op1.onRequestError,
      onResponse: [op2.onResponse, op1.onResponse],
      onResponseError: [op2.onResponseError, op1.onResponseError],
    });
  });
});
