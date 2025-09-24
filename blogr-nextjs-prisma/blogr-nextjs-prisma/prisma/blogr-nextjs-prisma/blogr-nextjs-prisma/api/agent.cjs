// api/agent.cjs (CommonJS)
const { base, methodGuard, json } = require('./_utils.js');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const upstream = base();
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, base: upstream });
  }

  if (!methodGuard(req, res, ['POST'])) return;

  try {
    const body = await json(req);
    const r = await fetch(`${upstream}/api/agent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    try {
      res.status(r.status).json(JSON.parse(text));
    } catch {
      res.status(r.status).send(text);
    }
  } catch (e) {
    res.status(502).json({
      error: "Upstream /api/agent failed",
      backend: upstream,
      detail: String(e?.message || e)
    });
  }
};
