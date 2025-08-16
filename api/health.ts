export const config = { runtime: 'nodejs' };
export default function handler(_req, res) {
  res.status(200).json({ ok: true, from: 'vercel' });
}
