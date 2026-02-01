import React from 'react';
import { getYouTubeEmbedUrl } from '../lib/videoUtils';

interface YouTubeEmbedProps {
  url: string;
  autoplay?: boolean;
  mute?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, autoplay = false, mute = false }) => {
  const embedUrl = getYouTubeEmbedUrl(url, { autoplay: autoplay ? 1 : 0, mute: mute ? 1 : 0 });
  
  if (!embedUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        title="YouTube video player"
      />
    </div>
  );
};

export default YouTubeEmbed;
