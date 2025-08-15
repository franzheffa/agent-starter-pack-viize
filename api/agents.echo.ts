import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_VIIZE_AGENT_GEMINI_URL ||
  process.env.GATEWAY_URL ||
  '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!BASE) throw new Error('Missing BASE URL');
    const url = new URL('/agents/echo', BASE);

    const upstream = await fetch(url.toString(), {
      method: req.method || 'POST',
      headers: { 'content-type': 'application/json' },
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    res.status(upstream.status).json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'proxy_failed', message: e?.message });
  }
}
