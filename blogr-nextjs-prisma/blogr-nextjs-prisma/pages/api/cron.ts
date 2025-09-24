import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel Cron déclenche un GET sur ce path.
  try {
    // Optionnel: ping du backend si requis
    // if (process.env.BACKEND) {
    //   await fetch(`${process.env.BACKEND}/health`).catch(() => {});
    // }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
}
