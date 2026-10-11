import http from 'node:http';

const port = Number(process.env.PROVOD_BALANCE_PORT || 8787);
let apiKey = process.env.PROVOD_API_KEY || process.env.PROVODAI_API_KEY;
const endpoint = process.env.PROVOD_BALANCE_URL || 'https://api.provod.ai/v1/balance';

const readBody = async (request) => {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
};

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:19387');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.method === 'POST' && request.url === '/config') {
    try {
      const config = await readBody(request);
      if (typeof config.apiKey === 'string' && config.apiKey.trim()) apiKey = config.apiKey.trim();
      response.writeHead(204); response.end();
    } catch (error) {
      response.writeHead(400); response.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }
  if (request.method !== 'GET' || request.url !== '/balance') {
    response.writeHead(404); response.end(JSON.stringify({ error: 'Not found' })); return;
  }
  if (!apiKey) {
    response.writeHead(503); response.end(JSON.stringify({ error: 'Set PROVOD_API_KEY (or PROVODAI_API_KEY)' })); return;
  }
  try {
    const upstream = await fetch(endpoint, { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' } });
    const body = await upstream.text();
    response.writeHead(upstream.status); response.end(body || JSON.stringify({ error: `Provod returned HTTP ${upstream.status}` }));
  } catch (error) {
    response.writeHead(502); response.end(JSON.stringify({ error: error.message }));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Provod balance proxy listening on http://127.0.0.1:${port}/balance`));
