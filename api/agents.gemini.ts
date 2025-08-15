import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const r = await fetch(`${BASE}/agents/gemini`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'proxy_failed' });
  }
}
