import prisma from '../../lib/prisma';

export default async function handle(req, res) {
  const postId = String(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else {
    throw new Error(
      "The method " + req.method + " is not allowed at this route."
    );
  }
}
