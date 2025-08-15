export const config = { runtime: 'nodejs' };
export default async function handler(_req, res) {
  res.status(200).json({ ok: true, service: 'vercel-frontend' });
}
