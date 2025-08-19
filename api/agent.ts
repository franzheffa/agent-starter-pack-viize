import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', name: 'agent-starter-pack-viize' });
  }
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
      const message = body?.message ?? '';
      return res.status(200).json({ echo: message || null });
    } catch {
      return res.status(400).json({ error: 'Bad JSON' });
    }
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
