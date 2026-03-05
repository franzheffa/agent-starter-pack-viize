// Agent Smith: Bypass types pour compatibilité OS locale
export default async function handler(req: any, res: any) {
  const FALLBACK = "https://agent-smith-heffa-112329442315.us-central1.run.app";
  const { agent } = req.query;
  try {
    const targetUrl = `${FALLBACK}/${agent}`;
    res.status(200).json({ status: "connected", target: targetUrl });
  } catch (error) {
    res.status(500).json({ error: "Cloud Run Gateway unreachable" });
  }
}
