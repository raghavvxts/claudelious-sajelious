import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && !hasInteracted) {
        audioRef.current.volume = 1.0; // Instantly start at 100% volume
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          }).catch(() => {
            console.log("Autoplay blocked. Waiting for explicit user interaction.");
          });
        }
      }
    };

    // Modern browsers strictly block autoplay until the user interacts with the page.
    // We listen for any movement, scroll, click, or key press to automatically start the music.
    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
    window.addEventListener('mousemove', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });

    // Attempt to start immediately (works if user has visited the site before and browser allows it)
    startAudio();

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('mousemove', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      {/* The audio element: loop ensures it restarts automatically */}
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />
      
      {/* A subtle toggle button in the top right corner */}
      <button 
        onClick={toggleMute}
        className="fixed top-8 right-8 z-[100] w-12 h-12 rounded-full bg-charcoal-900/40 backdrop-blur-md border border-gold-500/20 flex items-center justify-center text-gold-500 hover:bg-charcoal-900/80 hover:border-gold-500/60 transition-all cursor-pointer group shadow-[0_0_20px_rgba(205,166,95,0.05)]"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} className="opacity-50" />}
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-charcoal-900/90 text-parchment-200 text-xs px-3 py-1.5 rounded border border-gold-500/20 pointer-events-none font-serif italic tracking-wider">
          {isPlaying ? "Silence the Archives" : "Play the Hymn"}
        </div>
      </button>
    </>
  );
}
