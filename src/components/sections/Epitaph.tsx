import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function Epitaph() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate opacity sequences
  const candleOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.9, 0.95], [0, 1, 1, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.5, 0.6], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.7, 0.8], [0, 1, 1, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]); // Stays visible until candle goes out, then fades slightly or stays

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* The Candle */}
        <motion.div 
          style={{ opacity: candleOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
        >
          <div className="w-[200vw] h-[200vw] max-w-[800px] max-h-[800px] bg-radial-candle animate-pulse opacity-50" />
          <div className="absolute w-2 h-16 bg-gradient-to-b from-yellow-100 via-orange-400 to-transparent blur-sm animate-[pulse_0.5s_infinite_alternate]" />
        </motion.div>

        {/* Text 1 */}
        <motion.div style={{ opacity: text1Opacity }} className="absolute text-center z-10 w-full px-6">
          <p className="font-serif text-2xl md:text-4xl text-parchment-200/60 font-light tracking-wide">
            History remembers the inventors.
          </p>
        </motion.div>

        {/* Text 2 */}
        <motion.div style={{ opacity: text2Opacity }} className="absolute text-center z-10 w-full px-6">
          <p className="font-serif text-2xl md:text-4xl text-parchment-200 tracking-wide drop-shadow-lg">
            But history forgot who wrote the <span className="italic text-gold-400">prompt</span>.
          </p>
        </motion.div>

        {/* Final Reveal */}
        <motion.div style={{ opacity: finalOpacity }} className="absolute text-center z-20 w-full flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl tracking-tight leading-none text-gold-500 uppercase">
            Claudelius
            <br />
            <span className="italic">Sajelious Jr.</span>
          </h1>
          <p className="font-sans text-sm md:text-base font-light tracking-[0.3em] text-parchment-200/50 mt-8 uppercase">
            The man who made Claude think.
          </p>
          <div className="mt-16 pt-8 border-t border-gold-500/20">
            <p className="font-mono text-xs text-burgundy-800 tracking-[0.5em] font-bold">
              ARCHIVE SEALED
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
