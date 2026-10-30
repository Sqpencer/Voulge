// Vercel serverless function: /api/posts
// GET  -> public list of posts
// POST -> owner only (needs the ADMIN_PASSWORD env var as a Bearer token): check / create / delete
const crypto = require('crypto');

const KEY = 'voulge:posts';
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
async function loadPosts() {
  const raw = await redis(['GET', KEY]);
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
const savePosts = (posts) => redis(['SET', KEY, JSON.stringify(posts)]);

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
function isOwner(req) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const h = req.headers.authorization || '';
  const given = h.startsWith('Bearer ') ? h.slice(7) : '';
  return crypto.timingSafeEqual(sha(given), sha(pw));
}

module.exports = async (req, res) => {
  try {
    if (!REDIS_URL || !REDIS_TOKEN) return res.status(500).json({ error: 'storage_not_configured' });

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
      return res.status(200).json({ posts: await loadPosts() });
    }

    if (req.method === 'POST') {
      res.setHeader('Cache-Control', 'no-store');
      if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'admin_not_configured' });
      if (!isOwner(req)) {
        await new Promise((r) => setTimeout(r, 700)); // slow down password guessing
        return res.status(401).json({ error: 'unauthorized' });
      }
      let b = req.body;
      if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
      b = b || {};

      if (b.op === 'check') return res.status(200).json({ ok: true });

      if (b.op === 'create') {
        const text = String(b.text || '').trim().slice(0, 2000);
        const image = String(b.image || '').trim();
        if (!text && !image) return res.status(400).json({ error: 'empty' });
        if (image && !/^https:\/\/\S{1,500}$/.test(image)) return res.status(400).json({ error: 'bad_image' });
        const post = {
          id: Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
          text, image, at: new Date().toISOString(),
        };
        const posts = await loadPosts();
        posts.unshift(post);
        await savePosts(posts.slice(0, 200));
        return res.status(200).json({ post });
      }

      if (b.op === 'delete') {
        const posts = await loadPosts();
        await savePosts(posts.filter((p) => p.id !== String(b.id)));
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'bad_request' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
};
