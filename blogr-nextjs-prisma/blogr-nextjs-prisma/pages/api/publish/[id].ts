import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = String(req.query.id);
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}
