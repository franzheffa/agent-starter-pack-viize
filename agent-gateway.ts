import * as http from 'http';
import { GoogleAuth } from 'google-auth-library';

const handleRequest = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  // On ne répond qu'à la racine "/", les autres URL ne sont pas trouvées
  if (req.url !== '/') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  try {
    console.log("Authentification avec Google...");
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient("https://viize-agent-gemini-112329442315.us-central1.run.app");

    console.log("Appel du service distant...");
    const result = await client.request({ url: "https://viize-agent-gemini-112329442315.us-central1.run.app/" });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));

  } catch (err) {
    console.error("❌ L'appel à Cloud Run a échoué:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Agent injoignable" }));
  }
};

const server = http.createServer(handleRequest);
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Serveur démarré et à l'écoute sur le port ${port}`);
});
