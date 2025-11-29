import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = String(req.query.id || '');
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!postId) return res.status(400).json({ error: 'Missing id' });

  const post = await prisma.post.update({ where: { id: postId }, data: { published: true } });
  res.json(post);
}
