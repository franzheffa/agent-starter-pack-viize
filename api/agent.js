export default async function handler(req, res) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL;
  if (!base) return res.status(500).json({ error: 'API base URL missing' });

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, base });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const upstream = await fetch(`${base}/agents/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });
    const data = await upstream.json();
    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upstream error' });
  }
}
