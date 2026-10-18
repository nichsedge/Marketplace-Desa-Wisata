/**
 * Helper utility to parse and format video URLs for web embedding
 * Supports YouTube standard, short URLs, Shorts, Vimeo, and direct video files.
 */

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  embedUrl?: string;
  directUrl?: string;
}

export const parseVideoUrl = (rawUrl?: string): ParsedVideo => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'unknown' };
  }

  const url = rawUrl.trim();

  // YouTube matchers
  // 1. https://www.youtube.com/watch?v=VIDEO_ID
  // 2. https://youtu.be/VIDEO_ID
  // 3. https://www.youtube.com/shorts/VIDEO_ID
  // 4. https://www.youtube.com/embed/VIDEO_ID
  const ytWatchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
    };
  }

  // Vimeo matchers
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`
    };
  }

  // Direct MP4 / WebM / OGG files
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return {
      type: 'direct',
      directUrl: url
    };
  }

  return { type: 'unknown', directUrl: url };
};
