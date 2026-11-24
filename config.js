/* ===== SETUP: fill these in (shared by the main page and /live) =====
   pfp       : profile picture link from Imgur. Leave '' to show a placeholder "V".
   banner    : banner link from Imgur. Leave '' to show a placeholder gradient.
               Use the direct image link, e.g. https://i.imgur.com/AbC123.png
               (a plain https://imgur.com/AbC123 link also works; album links do not)
   pfpVideos, bannerVideos, pfpVoulge, pfpVoulg3, bannerVoulge, bannerVoulg3 : optional. Give each channel page its own
               profile picture / banner. Left out, they reuse pfp and banner above.
   apiKey    : YouTube Data API v3 key (Google Cloud Console). Restrict it to your site's domain.
   channelId : starts with UC...   OR   handle: '@yourhandle'
   maxVideos : how many videos + shorts to load (max 50)
   shortMax  : anything this many seconds or shorter counts as a Short (default 180)
   liveEvery : seconds between live subscriber checks while the /live page is open (default 1, minimum 1)
   invertLightBanners : true = banners that are mostly white get flipped to dark so they fit the site (set false to turn off)
   celebrateOnLoad : true = a visitor sees the celebration for the latest milestone once */
window.VOULGE_CONFIG={
  pfp:'https://i.imgur.com/EGyqxIA.png',      // home + about
  banner:'https://i.imgur.com/6BrcY8p.png',   // home hero
  pfpVideos:'',                               // Videos page pfp (empty = reuses pfp above)
  bannerVideos:'',                            // Videos page banner (empty = reuses banner above)
  pfpVoulge:'',                               // Voulge page pfp (empty = reuses pfp above)
  pfpVoulg3:'https://i.imgur.com/Ibm57Y2.jpeg', // Voulg3 page pfp
  bannerVoulge:'https://i.imgur.com/n2FUeC0.png', // Voulge page banner
  bannerVoulg3:'https://i.imgur.com/1izYxwh.png', // Voulg3 page banner
  apiKey:'AIzaSyAWB2EWdQg147KeW37M-HAiPEa4XZ2tMgY',channelId:'UClC8ramdKXZXUwQqTjuDRzw',handle:'@Voulge',maxVideos:12,shortMax:180,liveEvery:1,celebrateOnLoad:true,invertLightBanners:true
};
