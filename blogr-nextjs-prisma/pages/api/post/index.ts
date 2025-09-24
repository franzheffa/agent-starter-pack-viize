import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { title, content } = req.body;
  const session = await getSession({ req });
  if (!session?.user?.email) return res.status(401).json({error:'unauthenticated'});

  const result = await prisma.post.create({
    data: { title, content, author: { connect: { email: session.user.email } } },
  });
  res.json(result);
}
