
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scriptId = 'instagram-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const processEmbed = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        // Give some time for IG to render before hiding skeleton
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = processEmbed;
      document.body.appendChild(script);
    } else {
      processEmbed();
    }

    // Re-process if URL changes
    processEmbed();
  }, [url]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fbfaf8] z-10 rounded-[2.5rem]">
          <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Loading Reel...</p>
        </div>
      )}
      
      <div className="w-full max-w-[420px] mx-auto overflow-hidden rounded-[2.5rem] bg-white shadow-2xl p-0 border border-[#c5a059]/10 transition-opacity duration-500" style={{ opacity: isLoading ? 0 : 1 }}>
        <blockquote
          className="instagram-media w-full"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ 
            width: '100%', 
            margin: '0 auto',
            background: '#FFF',
            border: '0',
            borderRadius: '24px',
            boxShadow: 'none',
            padding: '0'
          }}
        >
          <div style={{ padding: '16px' }}>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#c5a059] text-xs font-bold"
            >
              View on Instagram
            </a>
          </div>
        </blockquote>
      </div>

      {!isLoading && (
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]/30 animate-pulse">
          Tap video to play
        </p>
      )}
    </div>
  );
};

export default InstagramEmbed;
