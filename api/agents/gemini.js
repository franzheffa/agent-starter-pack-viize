module.exports = async (req, res) => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
      || process.env.API_BASE_URL
      || "https://agent-gateway-fqsvjamshq-ew.a.run.app";

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const payload = {
      prompt: body.prompt || String((req.query && req.query.q) || ''),
      imageUrl: body.imageUrl || undefined,
    };

    const r = await fetch(`${API_BASE}/agents/gemini`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
    if (!r.ok) return res.status(502).json({ ok:false, from:'gateway', status:r.status, ...json });
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ ok:false, error: String(e && e.message || e) });
  }
};
