// Agent Smith-Heffa: Production Gateway Proxy (Bypass Types for Mac Compatibility)
export default async function handler(req: any, res: any) {
  const CLOUD_RUN_URL = "https://agent-smith-heffa-112329442315.us-central1.run.app";
  const { agent } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    res.status(200).json({
      status: "active",
      gateway: "Vercel Edge",
      target: `${CLOUD_RUN_URL}/${agent}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Gateway connection failed" });
  }
}
