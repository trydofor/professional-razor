import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { createFetch, FetchError } from 'ofetch';
import { useEventBus } from '@vueuse/core';
import { useApiRoute, apiRouteAuthOptions, apiRouteAuthEventBus, apiRouteFetchError } from '../composables/UseApiRoute';

const session = 'wings-session';
const cookie = `session=${session}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
const server = setupServer(
  http.get('/api/v1/test-get.json', ({ request }) => {
    const contentType = request.headers.get('content-type');
    return HttpResponse.json({
      success: true,
      data: contentType,
    });
  }),
  http.post('/api/v1/test-post.json', ({ request }) => {
    const contentType = request.headers.get('content-type');
    return HttpResponse.json({
      success: true,
      data: contentType,
    });
  }),
  http.post('/api/v1/test-401.json', () => {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),
  http.post('/api/v1/test-403.json', () => {
    return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
  }),
  http.post('/api/v1/test-session.json', () => {
    return HttpResponse.json({
      success: true,
      data: cookie,
    }, { headers: { 'Set-Cookie': cookie, 'Session': session } });
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  // eslint-disable-next-line
  // @ts-ignore https://github.com/nuxt/test-utils/issues/775
  // 404 Cannot find any path matching /api/v1/test-get.json if comment
  globalThis.$fetch = createFetch();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('useApiRoute with real $fetch requests', () => {
  it('should send GET request with correct Content-Type (no body)', async () => {
    const { get, raw } = useApiRoute();
    const rs1 = await get('/test-get.json');
    console.log('get', JSON.stringify(rs1));
    expect(rs1.data).toBeNull();
    const rs2 = await raw('/test-get.json', { method: 'get' });
    console.log('get', JSON.stringify(rs2));
    expect(rs2._data).toEqual({ success: true, data: null });
  });

  it('should send POST request with JSON Content-Type', async () => {
    const { post, raw } = useApiRoute();
    const jsonBody = { key: 'value' };
    const rs1 = await post('/test-post.json', jsonBody);
    console.log('post JSON', JSON.stringify(rs1));
    expect(rs1.data).toBe('application/json');
    const rs2 = await raw('/test-post.json', { method: 'post', body: jsonBody });
    console.log('post JSON', JSON.stringify(rs2));
    expect(rs2._data).toEqual({ success: true, data: 'application/json' });
  });

  it('should send POST request with FormData Content-Type', async () => {
    const { post } = useApiRoute();
    const formData = new FormData();
    formData.append('key', 'value');

    const rs = await post('/test-post.json', formData);
    console.log('post FormData', JSON.stringify(rs));
    // in nuxt dev, it auto set `multipart/form-data; boundary`, but test not !!
    // expect(rs.data).toContain('multipart/form-data');
  });

  it('should send POST request with URLSearchParams Content-Type', async () => {
    const { post } = useApiRoute();
    const params = new URLSearchParams();
    params.append('key', 'value');

    const rs = await post('/test-post.json', params);
    console.log('post SearchParams', JSON.stringify(rs));
    expect(rs.data).toContain('application/x-www-form-urlencoded');
  });

  it('should send POST request with option', async () => {
    const { post } = useApiRoute();
    const params = new URLSearchParams();
    params.append('key', 'value');

    const opt = { options: {} };
    const rs = await post('/test-post.json', params, { k1: 'v2' }, {
      onRequest: (ctx) => {
        // console.log('ctx', JSON.stringify(ctx));
        opt.options = JSON.stringify(ctx.options);
      },
    });
    console.log('post SearchParams', JSON.stringify(rs));
    console.log('onRequest', JSON.stringify(opt));
    expect(rs.data).toContain('application/x-www-form-urlencoded');
    expect(opt.options).toContain('"query":{"k1":"v2"}');
    expect(opt.options).toContain('"params":{"k1":"v2"}');
  });

  it('should send POST with Auth Event', async () => {
    const opts = apiRouteAuthOptions([401, 403, 'set-cookie']);
    const { post } = useApiRoute(opts);
    const eventSpy = vi.fn();

    apiRouteAuthEventBus.on((ev) => {
      eventSpy(ev);
    });

    await expect(post('/test-401.json')).rejects.toSatisfy((error: SafeAny) => {
      const fe = apiRouteFetchError(error);
      return JSON.stringify(fe?.data) === JSON.stringify({ success: false });
    });
    await expect(post('/test-403.json')).rejects.toSatisfy((error: SafeAny) => {
      const fe = apiRouteFetchError(error);
      return fe?.status === 403;
    });

    await post('/test-session.json');
    expect(eventSpy).toHaveBeenNthCalledWith(1, { status: 401 });
    expect(eventSpy).toHaveBeenNthCalledWith(2, { status: 403 });
    expect(eventSpy).toHaveBeenNthCalledWith(3, { status: 200, session: session, headers: { 'set-cookie': cookie } });
  });

  it('should send POST with Auth Event replace error or result', async () => {
    const authEventBus = useEventBus('test-useapi-event-bus');

    const opts = apiRouteAuthOptions([401, 403], (_, evt) => {
      authEventBus.emit(evt);
      if (evt.status === 403) return new FetchError('error-403');
    });
    const { post } = useApiRoute(opts);
    const eventSpy = vi.fn();

    authEventBus.on((ev) => {
      eventSpy(ev);
    });

    await expect(post('/test-401.json')).rejects.toMatchObject({
      status: 401,
    });
    await expect(post('/test-403.json')).rejects.toSatisfy((err: SafeAny) => {
      return err.cause.message === 'error-403';
    });

    expect(eventSpy).toHaveBeenNthCalledWith(1, { status: 401 });
    expect(eventSpy).toHaveBeenNthCalledWith(2, { status: 403 });
  });
});

describe('merge options', () => {
  const op1 = {
    onRequest: () => { console.log('onRequest 1'); },
    onRequestError: () => { console.log('onRequestError 1'); },
    onResponse: () => { console.log('onResponse 1'); },
    onResponseError: () => { console.log('onResponseError 1'); },
  } as NonNullable<Parameters<typeof $fetch>[1]>;

  const op2 = {
    onRequest: () => { console.log('onRequest 2'); },
    onRequestError: () => { console.log('onRequestError 2'); },
    onResponse: () => { console.log('onResponse 2'); },
    onResponseError: () => { console.log('onResponseError 2'); },
  } as NonNullable<Parameters<typeof $fetch>[1]>;

  it('returns empty object if ops and op are null or undefined', () => {
    const { opt } = useApiRoute();
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
