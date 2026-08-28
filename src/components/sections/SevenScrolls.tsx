import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const SCROLLS = [
  { id: 'I', title: 'CONTEXT', text: 'To understand the universe, one must first supply the universe with 4,000 tokens of background information.' },
  { id: 'II', title: 'ARCHITECTURE', text: 'A system so complex it requires three scribes just to draw the boxes.' },
  { id: 'III', title: 'IMPLEMENTATION', text: 'The act of transcribing the Oracle’s wisdom into reality.' },
  { id: 'IV', title: 'REFINEMENT', text: 'The realization that the Oracle misunderstood the word "simple."' },
  { id: 'V', title: 'DEBUGGING', text: 'Blaming the Oracle for a mistake Sajelious made.' },
  { id: 'VI', title: '"MAKE IT BETTER"', text: 'A completely unreasonable request for aesthetic perfection.' },
  { id: 'VII', title: '"ONE LAST THING"', text: 'The scroll that never ends. The cycle of eternal iteration.' },
];

export function SevenScrolls() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate the horizontal translation
  // By interpolating a raw number first, we bypass Framer Motion's string interpolation bugs entirely.
  const scrollRatio = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const xTranslate = useTransform(scrollRatio, (val) => `calc(${val}% - ${val}vw)`);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-transparent">
      
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-transparent">
        
        {/* Title */}
        <div className="absolute top-12 left-12 z-20">
          <h2 className="font-serif text-3xl text-gold-500 uppercase">
            The Seven Scrolls
          </h2>
          <div className="w-12 h-[2px] bg-gold-600 mt-2" />
        </div>

        {/* Horizontal Container */}
        <motion.div 
          style={{ x: xTranslate }}
          className="flex items-center gap-12 md:gap-32 px-[10vw] w-[max-content]"
        >
          {SCROLLS.map((scroll, index) => (
            <div 
              key={scroll.id} 
              className="relative w-[80vw] md:w-[40vw] h-[60vh] bg-[#b8ad98] border border-parchment-800/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col p-12 shrink-0"
              style={{
                boxShadow: 'inset 0 0 60px rgba(74, 65, 50, 0.05), 0 30px 60px rgba(0,0,0,0.8)'
              }}
            >
              {/* Wax Seal Decoration */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-burgundy-900 shadow-md flex items-center justify-center border border-gold-500/30">
                <span className="font-serif text-gold-400 text-xs italic">{scroll.id}</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="font-serif text-3xl md:text-5xl text-charcoal-900 mb-8 border-b pb-4 border-charcoal-900/20">
                  Scroll {scroll.id}
                  <br/>
                  <span className="text-xl md:text-2xl text-burgundy-900 italic mt-2 block">
                    {scroll.title}
                  </span>
                </h3>
                
                <p className="font-sans text-charcoal-800/90 leading-relaxed font-medium text-lg">
                  {scroll.text}
                </p>

                {index === SCROLLS.length - 1 && (
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#b8ad98] to-transparent flex items-end justify-center pb-8">
                    <p className="font-mono text-xs text-charcoal-900/40 uppercase tracking-widest">
                      (Scroll still being written...)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
