import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { agent } = req.query;
  const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL || "https://agent-smith-heffa-112329442315.us-central1.run.app";

  // Simulation de santé pour validation Google
  res.status(200).json({
    status: "READY",
    platform: "Buttertech AI",
    agent_id: agent,
    gateway_node: "Vercel-IAD1",
    connection: "GCP-Cloud-Run-Secure",
    endpoint: `${CLOUD_RUN_URL}/${agent}`,
    uptime: process.uptime()
  });
}
