/** Host half: Harness performs the upstream request, avoiding browser CORS. */
let apiKey = '';
let endpoint = 'https://api.provod.ai/v1/balance';
let profileName = 'Provod AI';

export const inject = ['connection'];
export function apply(ctx) {
  const routes = [
    { path: '/api/provod-balance/config', methods: ['POST'], handler: async (request) => {
      const body = await request.json().catch(() => ({}));
      if (typeof body.apiKey === 'string') apiKey = body.apiKey.trim();
      if (typeof body.endpoint === 'string' && /^https:\/\//i.test(body.endpoint)) endpoint = body.endpoint.trim();
      if (typeof body.profileName === 'string' && body.profileName.trim()) profileName = body.profileName.trim();
      return Response.json({ ok: true, profileName });
    } },
    { path: '/api/provod-balance/balance', methods: ['GET'], handler: async () => {
      if (!apiKey) return Response.json({ error: 'API-ключ не задан' }, { status: 401 });
      try {
        const upstream = await fetch(endpoint, { headers: { accept: 'application/json', authorization: `Bearer ${apiKey}` } });
        const body = await upstream.text();
        return new Response(body || JSON.stringify({ error: `Provod HTTP ${upstream.status}` }), { status: upstream.status, headers: { 'content-type': 'application/json' } });
      } catch (error) { return Response.json({ error: error.message }, { status: 502 }); }
    } }
  ];
  for (const route of routes) ctx.connection.fetch.register({ path: route.path, methods: route.methods, requestBody: 'buffered', fetch: route.handler });
  return () => {};
}
