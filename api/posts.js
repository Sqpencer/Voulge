// api/posts.js — owner-only community posts for Voulge (Vercel Serverless Function)
//
// Storage : Upstash Redis (free) from the Vercel Marketplace. No npm packages needed.
// Env vars: ADMIN_PASSWORD            (you choose it; it's the owner sign-in password)
//           KV_REST_API_URL           (added automatically when you connect Upstash Redis)
//           KV_REST_API_TOKEN         (added automatically when you connect Upstash Redis)
//
// Endpoints (what your site already calls):
//   GET  /api/posts                      -> { posts: [{ id, text, image, at }, ...] }   newest first
//   POST /api/posts  { op: 'check' }                       -> { ok: true }
//   POST /api/posts  { op: 'create', text, image }         -> { post }
//   POST /api/posts  { op: 'delete', id }                  -> { ok: true }
//   POST requests need the header  Authorization: Bearer <ADMIN_PASSWORD>

const crypto = require('crypto');

const KEY = 'voulge:posts';
const MAX_POSTS = 500;     // oldest posts are dropped past this
const MAX_SHOWN = 100;     // how many the site loads

async function redis(cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || 'redis ' + r.status);
  return j.result;
}

function sameSecret(a, b) {
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(a), h(b));
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const send = (code, body) => res.status(code).json(body);

  const hasStore =
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!hasStore) return send(500, { error: 'storage_not_configured' });

  try {
    // ---------- public: read posts ----------
    if (req.method === 'GET') {
      const rows = await redis(['LRANGE', KEY, 0, MAX_SHOWN - 1]);
      const posts = (rows || [])
        .map((s) => { try { return JSON.parse(s); } catch { return null; } })
        .filter(Boolean);
      return send(200, { posts });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(405, { error: 'method_not_allowed' });
    }

    // ---------- owner only below ----------
    const admin = process.env.ADMIN_PASSWORD;
    if (!admin) return send(500, { error: 'admin_not_configured' });

    // brute-force guard: 8 wrong passwords per IP, then locked for 15 minutes
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const failKey = 'voulge:fail:' + ip;
    if ((+(await redis(['GET', failKey])) || 0) >= 8) return send(429, { error: 'too_many_attempts' });

    const pass = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!pass || !sameSecret(pass, admin)) {
      const n = await redis(['INCR', failKey]);
      if (n === 1) await redis(['EXPIRE', failKey, 900]);
      return send(401, { error: 'unauthorized' });
    }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    if (body.op === 'check') return send(200, { ok: true });

    if (body.op === 'create') {
      const text = String(body.text || '').trim().slice(0, 2000);
      const image = String(body.image || '').trim();
      if (!text && !image) return send(400, { error: 'empty' });
      if (image && (!/^https:\/\/\S+$/.test(image) || image.length > 500)) return send(400, { error: 'bad_image' });
      const post = { id: crypto.randomUUID(), text, image, at: new Date().toISOString() };
      await redis(['LPUSH', KEY, JSON.stringify(post)]);
      await redis(['LTRIM', KEY, 0, MAX_POSTS - 1]);
      return send(200, { post });
    }

    if (body.op === 'delete') {
      const id = String(body.id || '');
      const rows = (await redis(['LRANGE', KEY, 0, -1])) || [];
      const row = rows.find((s) => { try { return JSON.parse(s).id === id; } catch { return false; } });
      if (!row) return send(404, { error: 'not_found' });
      await redis(['LREM', KEY, 1, row]);
      return send(200, { ok: true });
    }

    return send(400, { error: 'bad_op' });
  } catch (e) {
    console.error('posts api error:', e.message);
    return send(500, { error: 'server_error' });
  }
};
