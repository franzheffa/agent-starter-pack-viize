import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    service: "Gemini Pro",
    status: "Online",
    integration: "Google Cloud Vertex AI",
    latency: "optimized"
  });
}
