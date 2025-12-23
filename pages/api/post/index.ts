import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body;
  const session = await getSession({ req });
  if (session) {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: session?.user?.email as string } },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}
