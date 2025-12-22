import prisma from '../prisma';

export default async function handle(req, res) {
  const postId = String(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({ where: { id: postId } });
    res.json(post);
  } else {
    throw new Error("Method " + req.method + " not allowed.");
  }
}
