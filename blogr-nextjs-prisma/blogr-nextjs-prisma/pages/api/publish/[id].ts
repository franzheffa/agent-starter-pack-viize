import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const postId = String(req.query.id);
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}
