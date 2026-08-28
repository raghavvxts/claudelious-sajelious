import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { ClaudeOracleCore } from '../3d/ClaudeOracleCore';

export function ClaudeOracle() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Dialogue fades
  const op1 = useTransform(scrollYProgress, [0.05, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.5, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0.7, 0.75, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-transparent">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* R3F Oracle Core */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ClaudeOracleCore />
          </Canvas>
          <div className="absolute inset-0 bg-radial-candle mix-blend-screen pointer-events-none opacity-50" />
        </div>

        {/* Section Title */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center">
          <h2 className="font-serif text-sm tracking-[0.4em] text-parchment-200/40 uppercase">
            The Consultation
          </h2>
        </div>

        {/* Floating Dialogue */}
        <div className="relative z-10 w-full max-w-2xl px-6 mx-auto flex flex-col items-center">
          
          <motion.div style={{ opacity: op1 }} className="absolute w-full text-center top-1/2 -translate-y-1/2">
            <p className="font-serif italic text-3xl md:text-5xl text-gold-500 drop-shadow-lg">
              "Claude, I have an idea."
            </p>
            <p className="font-mono text-[10px] text-parchment-200/30 uppercase tracking-widest mt-4">
              Sajelious - 1741
            </p>
          </motion.div>

          <motion.div style={{ opacity: op2 }} className="absolute w-full text-center top-1/2 -translate-y-1/2">
            <div className="bg-charcoal-900/80 backdrop-blur-sm border border-parchment-200/10 p-6 rounded-sm">
              <p className="font-mono text-xs md:text-sm text-parchment-200/80 leading-relaxed text-left">
                <span className="text-gold-400">CLAUDE:</span> Certainly. Here is a possible implementation based on your requirements...
              </p>
            </div>
          </motion.div>

          <motion.div style={{ opacity: op3 }} className="absolute w-full text-center top-1/2 -translate-y-1/2">
            <p className="font-serif italic text-7xl md:text-9xl text-burgundy-800 font-bold drop-shadow-[0_0_50px_rgba(94,33,41,0.5)]">
              "No."
            </p>
          </motion.div>

          <motion.div style={{ opacity: op4 }} className="absolute w-full text-center top-1/2 -translate-y-1/2">
            <p className="font-serif italic text-3xl md:text-5xl text-gold-500 drop-shadow-lg">
              "Make it more cinematic."
            </p>
            <div className="w-12 h-[1px] bg-gold-500/50 mx-auto mt-6" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
