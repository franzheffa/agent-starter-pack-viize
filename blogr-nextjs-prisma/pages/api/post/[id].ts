import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const postId = String(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({ where: { id: postId } });
    return res.json(post);
  }
  res.status(405).end();
}
