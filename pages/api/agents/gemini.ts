import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    agent: "SMITH-HEFFA",
    status: "EN LIGNE",
    model: "Gemini 1.5 Pro",
    provider: "Google Vertex AI",
    latency: "24ms",
    signature: "Buttertech Gold Edition"
  });
}
