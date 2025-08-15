export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
    if (!API_BASE) return res.status(500).json({ ok:false, error:'Missing NEXT_PUBLIC_API_BASE_URL' });

    const message =
      req.method === 'GET'
        ? String(req.query.q ?? '')
        : (req.body?.message ?? req.body?.q ?? '');

    const r = await fetch(`${API_BASE}/agents/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: message || 'ping' }),
    });

    const text = await r.text();
    try { res.status(r.status).json(JSON.parse(text)); }
    catch { res.status(r.status).json({ raw: text, status: r.status }); }
  } catch (e) {
    res.status(500).json({ ok:false, error: (e as Error).message });
  }
}
