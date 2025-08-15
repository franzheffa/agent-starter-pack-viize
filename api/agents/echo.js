module.exports = async (req, res) => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
      || process.env.API_BASE_URL
      || "https://agent-gateway-fqsvjamshq-ew.a.run.app";

    const isGet = req.method === 'GET';
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const message = isGet ? String((req.query && req.query.q) || '') : (body.message || body.q || 'ping');

    const r = await fetch(`${API_BASE}/agents/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const text = await r.text();
    try { res.status(r.status).json(JSON.parse(text)); }
    catch { res.status(r.status).json({ raw: text, status: r.status }); }
  } catch (e) {
    res.status(500).json({ ok:false, error: String(e && e.message || e) });
  }
};
