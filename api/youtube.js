// Vercel serverless function: GET /api/youtube
// Needs one environment variable in Vercel: YOUTUBE_API_KEY
// Optional: YOUTUBE_CHANNEL_ID (defaults to the id below)

const DEFAULT_CHANNEL_ID = 'UClC8ramdKXZXUwQqTjuDRzw';
const DEFAULT_HANDLE = '@Voulge';
const API = 'https://www.googleapis.com/youtube/v3';

async function yt(path, params, key) {
  const url = new URL(API + '/' + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('key', key);
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (j.error && (j.error.message || j.error.status)) || ('youtube http ' + r.status);
    const err = new Error(msg);
    err.status = r.status;
    throw err;
  }
  return j;
}

export default async function handler(req, res) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY is not set in Vercel environment variables' });
  }

  try {
    const id = process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;
    const base = { part: 'snippet,statistics,brandingSettings,contentDetails' };
    let ch = await yt('channels', Object.assign({ id }, base), key);
    if (!ch.items || !ch.items.length) {
      ch = await yt('channels', Object.assign({ forHandle: DEFAULT_HANDLE }, base), key);
    }
    if (!ch.items || !ch.items.length) {
      return res.status(404).json({ error: 'channel not found' });
    }
    const c = ch.items[0];

    // latest uploads
    let v = [];
    const uploads = c.contentDetails && c.contentDetails.relatedPlaylists && c.contentDetails.relatedPlaylists.uploads;
    if (uploads) {
      const pl = await yt('playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: 12 }, key);
      const ids = (pl.items || []).map(i => i.contentDetails.videoId).filter(Boolean);
      if (ids.length) {
        const vs = await yt('videos', { part: 'snippet,statistics', id: ids.join(',') }, key);
        v = (vs.items || []).map(x => {
          const th = x.snippet.thumbnails || {};
          return {
            id: x.id,
            t: x.snippet.title,
            th: (th.maxres || th.standard || th.high || th.medium || th.default || {}).url || '',
            views: +(x.statistics.viewCount || 0),
            likes: +(x.statistics.likeCount || 0),
            com: +(x.statistics.commentCount || 0),
            at: x.snippet.publishedAt
          };
        });
      }
    }

    const sn = c.snippet || {};
    const th = sn.thumbnails || {};
    const banner = c.brandingSettings && c.brandingSettings.image && c.brandingSettings.image.bannerExternalUrl;

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json({
      s: c.statistics || {},
      v,
      pfp: (th.high || th.medium || th.default || {}).url || '',
      banner: banner ? banner + '=w1920' : '',
      joined: sn.publishedAt || ''
    });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'youtube error' });
  }
}
