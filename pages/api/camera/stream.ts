import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { cameraId, visionData } = req.body;
      const result = await prisma.post.create({
        data: {
          title: "Camera " + cameraId + " Alert",
          content: JSON.stringify(visionData),
          published: true,
        },
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Database ingestion failed" });
    }
  }
  res.status(405).send({ message: 'Method not allowed' });
}
