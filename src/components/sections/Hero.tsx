import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { HeroMechanism } from '../3d/HeroMechanism';
import { scalarDepth, variants, springConfigs } from '../../lib/motionTokens';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Scalar Depth Multipliers
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', `${100 * scalarDepth.farBackground}%`]);
  const yMid = useTransform(scrollYProgress, [0, 1], ['0%', `${100 * scalarDepth.midEnvironment}%`]);
  const yMain = useTransform(scrollYProgress, [0, 1], ['0%', `${100 * scalarDepth.mainContent}%`]);
  const yForeground = useTransform(scrollYProgress, [0, 1], ['0%', `${100 * scalarDepth.foreground}%`]);

  // Liquid Transition Exit Mask
  const opacityExit = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const maskSize = useTransform(scrollYProgress, [0.6, 1], ['100%', '0%']);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[150vh] bg-transparent overflow-hidden"
    >
      {/* Sticky Container */}
      <motion.div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: opacityExit }}
      >
        {/* R3F Canvas - Far Background */}
        <motion.div className="absolute inset-0 z-0 pointer-events-auto" style={{ y: yBg }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <HeroMechanism />
          </Canvas>
          <div className="absolute inset-0 bg-radial-candle pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 bg-charcoal-900/60 pointer-events-none" />
        </motion.div>

        {/* Metadata - Top Left */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={variants.fadeUp}
          className="absolute top-12 left-12 z-50 hidden md:flex flex-col items-start"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-gold-500 mb-2 uppercase">
            Archive No. CSJ-001
          </p>
          <div className="w-12 h-[1px] bg-gold-500/30" />
          <p className="font-mono text-[10px] tracking-widest text-parchment-200/50 mt-2">
            AUTHENTICITY: QUESTIONABLE
          </p>
        </motion.div>

        {/* The Cinematic Composition */}
        <div className="relative w-full h-full flex flex-col items-center justify-center mt-10">
          
          {/* Fullscreen Portrait */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants.inkReveal}
            style={{ 
              y: yMain,
              WebkitMaskImage: `radial-gradient(circle ${maskSize} at center, black 0%, transparent 100%)`
            }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <motion.div 
              className="relative w-full h-full opacity-40 hover:opacity-60 transition-all duration-1000 ease-out"
            >
              <img 
                src="/portrait.png" 
                alt="Claudelious Sajelious Jr." 
                className="object-cover object-top w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" fill="%23cda65f" font-family="sans-serif" font-size="20" text-anchor="middle">Portrait Placeholder</text></svg>';
                }}
              />
              {/* Heavy vignette and gradients so the text remains legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-charcoal-900 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(18,18,18,1)] pointer-events-none mix-blend-multiply" />
            </motion.div>
          </motion.div>

          {/* Background Text - CLAUDELIUS (Now z-20 so it sits atop the fullscreen image but uses mix-blend to fuse with it) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfigs.cinematic, delay: 0.1 }}
            style={{ y: yMid }}
            className="absolute z-20 w-full text-center pointer-events-none top-1/4 -mt-12"
          >
            <h1 className="font-serif text-[12vw] leading-none tracking-tight text-parchment-200/50 mix-blend-overlay uppercase">
              Claudelius
            </h1>
          </motion.div>

          {/* Foreground Text - SAJELIOUS JR. */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfigs.cinematic, delay: 0.3 }}
            style={{ y: yForeground }}
            className="absolute z-30 w-full text-center pointer-events-none bottom-1/4 mb-4"
          >
            <h2 className="font-serif italic text-[9vw] leading-none tracking-tighter text-gold-500 drop-shadow-2xl">
              Sajelious Jr.
            </h2>
            <div className="flex flex-col items-center mt-6">
              <p className="font-sans text-xs md:text-sm font-light tracking-[0.4em] text-parchment-200 uppercase">
                The Forgotten Father of Claude-Driven Innovation
              </p>
              <p className="font-serif italic text-xl text-gold-500/70 mt-3">
                1723 — ∞
              </p>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-40"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
