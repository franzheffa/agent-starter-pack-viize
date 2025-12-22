import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = String(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({ where: { id: postId } });
    res.json(post);
  } else {
    res.status(405).send({ message: 'Method not allowed' });
  }
}
