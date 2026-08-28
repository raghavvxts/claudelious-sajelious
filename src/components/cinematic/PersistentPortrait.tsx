import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export function PersistentPortrait() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Show after scrolling roughly 100vh (about 800px)
    if (latest > 800 && !isVisible) {
      setIsVisible(true);
    } else if (latest <= 800 && isVisible) {
      setIsVisible(false);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      // WebKit (Safari) has a known glitch where it renders square boundaries around border-radius + overflow-hidden 
      // elements if they have a transform/shadow. Adding rounded-[50%] and isolation/translateZ(0) fixes it.
      className={`fixed bottom-8 right-8 z-[100] w-28 md:w-40 lg:w-48 aspect-[3/4] rounded-[50%] overflow-hidden border border-gold-500/40 shadow-[0_0_40px_rgba(205,166,95,0.2)] group cursor-pointer [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      whileHover={{ scale: 1.05 }}
    >
      <img 
        src="/portrait.png" 
        alt="Claudelious Sajelious Jr." 
        className="w-full h-full object-cover object-top opacity-60 brightness-75 saturate-50 contrast-125 group-hover:opacity-100 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-700 ease-out"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" fill="%23cda65f" font-family="sans-serif" font-size="12" text-anchor="middle">Portrait Placeholder</text></svg>';
        }}
      />
      {/* Soft inner shadow to blend edges */}
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(18,18,18,0.9)] pointer-events-none" />
      
      {/* Comedic/Cinematic Tooltip on Hover */}
      <div className="absolute inset-0 bg-charcoal-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
        <p className="font-serif italic text-gold-500 text-sm md:text-base leading-tight">
          "He is always watching."
        </p>
      </div>
    </motion.div>
  );
}
