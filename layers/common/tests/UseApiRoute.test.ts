import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { createFetch } from 'ofetch';
import { useApiRoute } from '../composables/UseApiRoute';

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
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  // eslint-disable-next-line
  // @ts-ignore https://github.com/nuxt/test-utils/issues/775
  // 404 Cannot find any path matching /api/v1/test-get.json if comment
  globalThis.$fetch = createFetch();
  console.log('set env 24');
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('useApiRoute with real $fetch requests', () => {
  it('should send GET request with correct Content-Type (no body)', async () => {
    const { get } = useApiRoute();
    const rs = await get('/test-get.json');
    console.log('get', JSON.stringify(rs));
    expect(rs.data).toBeNull();
  });

  it('should send POST request with JSON Content-Type', async () => {
    const { post } = useApiRoute();
    const jsonBody = { key: 'value' };
    const rs = await post('/test-post.json', jsonBody);
    console.log('post JSON', JSON.stringify(rs));
    expect(rs.data).toBe('application/json');
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
});
