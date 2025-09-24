// api/voice/tts.cjs (CommonJS)
const { base } = require('../_utils.js');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const upstream = base();
  const r = await fetch(`${upstream}/api/voice/tts`, {
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] || 'application/json' },
    body: req.method === 'POST' ? req.body : undefined
  });
  const buf = Buffer.from(await r.arrayBuffer());
  res.setHeader('Content-Type', r.headers.get('content-type') || 'audio/mpeg');
  res.status(r.status).send(buf);
};
