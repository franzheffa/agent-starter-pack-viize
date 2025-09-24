import { base as gw } from './_utils.js';
export default async function handler(req, res) {
  const upstream = gw();
  const r = await fetch(`${upstream}/api/voice`, {
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] || 'application/json' },
    body: req.method === 'POST' ? req.body : undefined
  });
  const text = await r.text();
  res.status(r.status).send(text);
}
