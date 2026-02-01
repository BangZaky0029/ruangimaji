
import React from 'react';
import { getVideoPlatform } from '../lib/videoUtils';
import YouTubeEmbed from './YouTubeEmbed';
import InstagramEmbed from './InstagramEmbed';

interface VideoEmbedProps {
  url: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url }) => {
  const platform = getVideoPlatform(url);

  return (
    <div className="w-full flex items-center justify-center py-4">
      {platform === 'youtube' && (
        <div className="w-full max-w-6xl">
          <YouTubeEmbed url={url} />
        </div>
      )}

      {platform === 'instagram' && (
        <InstagramEmbed url={url} />
      )}

      {!platform && (
        <div className="w-full aspect-video rounded-[2.5rem] border-2 border-dashed border-[#c5a059]/20 flex flex-col items-center justify-center text-center bg-[#fbfaf8] p-8 max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#f3eee5] flex items-center justify-center text-[#c5a059] mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <p className="text-[#2d2a26]/60 text-sm font-medium">Link video tidak didukung atau tidak valid.</p>
          <p className="text-[#c5a059]/60 text-[10px] uppercase tracking-widest mt-2">Gunakan link YouTube atau Instagram Reels</p>
        </div>
      )}
    </div>
  );
};

export default VideoEmbed;
