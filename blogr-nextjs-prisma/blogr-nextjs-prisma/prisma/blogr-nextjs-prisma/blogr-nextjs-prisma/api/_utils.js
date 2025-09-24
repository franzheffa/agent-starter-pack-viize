// Le fichier _utils.js doit être en CommonJS pour être importé via `require`
const BACKEND = process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";
module.exports.base = () => BACKEND;
module.exports.methodGuard = (req, res, methods) => {
    if (!methods.includes(req.method)) {
        res.setHeader('Allow', methods.join(', '));
        res.status(405).json({ error: 'Method Not Allowed' });
        return false;
    }
    return true;
};
module.exports.json = (req) => {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => { resolve(JSON.parse(body || '{}')); });
    });
};
