// api/cron.cjs (CommonJS)
const { base } = require('./_utils.js');
const fetch = require('node-fetch');

module.exports = async (_req, res) => {
  const upstream = base();
  try {
    const r = await fetch(`${upstream}/health`);
    const t = await r.text();
    res.status(200).json({ ok: r.ok, backend: upstream, health: t });
  } catch (e) {
    res.status(500).json({ ok: false, backend: upstream, error: String(e?.message || e) });
  }
};
