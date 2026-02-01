export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
    }
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
    return null;
  } catch {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
};

export const getYouTubeEmbedUrl = (url: string, params: { autoplay?: number; mute?: number; controls?: number; loop?: number } = {}) => {
  const id = getYouTubeId(url);
  if (!id) return '';
  const query = new URLSearchParams({
    autoplay: params.autoplay?.toString() || '0',
    mute: params.mute?.toString() || '0',
    controls: params.controls?.toString() || '1',
    rel: '0',
    modestbranding: '1',
    showinfo: '0',
    ... (params.loop ? { loop: '1', playlist: id } : {})
  });
  return `https://www.youtube.com/embed/${id}?${query.toString()}`;
};

export const isInstagramUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('instagram.com');
};

export const getInstagramShortcode = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts[0] === 'p' || parts[0] === 'reel' || parts[0] === 'tv') {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
};

export const getVideoPlatform = (url: string): 'youtube' | 'instagram' | null => {
  if (isYouTubeUrl(url)) return 'youtube';
  if (isInstagramUrl(url)) return 'instagram';
  return null;
};
