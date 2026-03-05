import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "online",
    service: "echo-test",
    echo: req.query.message || "No message provided",
    timestamp: new Date().toISOString()
  });
}
