import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function Laboratory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Use a numeric mapped transform for flawless string interpolation
  const scrollRatio = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const xTranslate = useTransform(scrollRatio, (val) => `calc(${val}% - ${val}vw)`);

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-charcoal-950">
      
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-charcoal-950">
        
        {/* Ambient Laboratory Lighting */}
        <div className="absolute inset-0 bg-radial-candle mix-blend-screen pointer-events-none opacity-30" />

        <div className="absolute top-12 left-12 z-20">
          <h2 className="font-serif text-sm tracking-[0.4em] text-gold-500 uppercase">
            His Workshop
          </h2>
          <p className="font-mono text-[10px] text-parchment-200/40 mt-2 tracking-widest">
            CLASSIFIED: HISTORICALLY SIGNIFICANT
          </p>
        </div>

        <motion.div 
          style={{ x: xTranslate }}
          className="flex items-center h-full w-[180vw] px-[10vw]"
        >
          {/* Parallax Layers */}
          <div className="relative w-full h-full flex items-center">
            
            {/* The Sacred Prompt Glass Case */}
            <div className="absolute left-[10vw] flex flex-col items-center">
              <div className="w-[30vw] md:w-[20vw] aspect-[2/3] border-4 border-parchment-800/20 bg-[#b8ad98] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <h3 className="font-serif text-charcoal-900 text-2xl md:text-3xl mb-4 text-center">THE SACRED PROMPT</h3>
                <p className="font-mono text-xs md:text-sm text-charcoal-800/70 leading-loose text-center font-bold">
                  CLAUDE THIS.<br/>
                  CLAUDE THAT.<br/>
                  CLAUDE CLAUDE CLAUDE.
                </p>
              </div>
              <p className="font-sans text-[10px] text-parchment-200/30 uppercase tracking-widest mt-6">
                The exact methodology remains classified.
              </p>
            </div>

            {/* The Anachronistic MacBook */}
            <div className="absolute left-[60vw] flex flex-col items-center">
              <div className="w-[40vw] md:w-[25vw] aspect-video border-b-8 border-parchment-800/20 bg-[#b8ad98] shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col group relative p-1 rounded-sm">
                <div className="w-full h-full bg-[#0d1117] p-4 flex flex-col overflow-hidden relative rounded-sm">
                   <p className="font-mono text-[10px] text-[#58a6ff]">sajelious@lab ~ % git status</p>
                   <p className="font-mono text-[10px] text-[#3fb950] mt-1">On branch main</p>
                   <p className="font-mono text-[10px] text-[#3fb950]">nothing to commit, working tree clean</p>
                   
                   <div className="absolute inset-0 bg-[#b8ad98]/95 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-1000">
                     <p className="font-serif italic text-charcoal-900 font-bold">Ancient Artifact #404</p>
                   </div>
                </div>
              </div>
              <p className="font-sans text-[10px] text-parchment-200/30 uppercase tracking-widest mt-6">
                Believed to be a mirror of scrying.
              </p>
            </div>

            {/* Giant Gears */}
            <div className="absolute left-[110vw] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-10 border-[40px] border-dashed border-gold-500 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute left-[125vw] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] opacity-20 border-[20px] border-dashed border-gold-500 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

          </div>
        </motion.div>

      </div>
    </section>
  );
}
