import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// DELETE /api/post/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = String(req.query.id || '');
  if (!postId) return res.status(400).json({ error: 'Missing id' });

  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({ where: { id: postId } });
    return res.json(post);
  }

  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
