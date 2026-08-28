import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const NODES = [
  { id: 'I', title: 'PROBLEM', desc: 'Sajelious observes an inefficiency in the universe.' },
  { id: 'II', title: 'HYPOTHESIS', desc: 'Sajelious develops 47 possible solutions.' },
  { id: 'III', title: 'THE CONSULTATION', desc: 'He summons his most trusted intellectual advisor: CLAUDE.' },
  { id: 'IV', title: 'THE PROMPT', desc: '"Claude, listen carefully..."' },
  { id: 'V', title: 'ITERATION', desc: 'Claude: "Here is a possible implementation—" / Sajelious: "No."' },
  { id: 'VI', title: '"MAKE IT BETTER"', desc: 'Claude provides an optimized version. It is rejected.' },
  { id: 'VII', title: 'INVENTION', desc: 'History is changed forever.' },
  { id: 'VIII', title: '"ONE MORE CHANGE"', desc: 'Sajelious reopens the prompt.' },
  { id: 'IX', title: 'FINAL INVENTION', desc: 'The perfect system is deployed.' },
  { id: 'X', title: '"ACTUALLY..."', desc: 'The cycle begins anew.' }
];

export function SajeliousMind() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-transparent border-t border-gold-500/10">
      
      <div className="max-w-4xl mx-auto px-6 text-center mb-24">
        <h2 className="font-serif text-4xl md:text-5xl text-parchment-200 tracking-widest uppercase mb-4">
          The Sajelious Mind
        </h2>
        <div className="w-24 h-[1px] bg-gold-500/50 mx-auto mb-6" />
        <p className="font-sans font-light text-parchment-200/50 uppercase tracking-[0.2em] text-sm">
          A Reconstruction of the Initial Thought Process
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        
        {/* The Central Animated Line */}
        <div className="absolute left-[39px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gold-500/10">
          <motion.div 
            className="w-full bg-gradient-to-b from-gold-400 via-gold-500 to-transparent origin-top"
            style={{ scaleY: scrollYProgress, height: '100%' }}
          />
        </div>

        {/* The Nodes */}
        <div className="flex flex-col gap-16 md:gap-24 relative z-10">
          {NODES.map((node, index) => {
            const isEven = index % 2 === 0;
            
            // Calculate when this specific node should animate based on its index
            const start = index / NODES.length;
            const opacity = useTransform(scrollYProgress, [start - 0.1, start], [0.2, 1]);
            const scale = useTransform(scrollYProgress, [start - 0.1, start], [0.8, 1]);
            const color = useTransform(scrollYProgress, [start - 0.1, start], ['#4a4132', '#cda65f']);

            return (
              <div key={node.id} className={`flex items-center w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Desktop Empty Space */}
                <div className="hidden md:block md:w-1/2" />
                
                {/* The Node Icon */}
                <div className="absolute left-0 md:relative md:left-auto md:mx-auto flex items-center justify-center w-20 h-20">
                  <motion.div 
                    style={{ scale, borderColor: color }}
                    className="w-12 h-12 rounded-full border-2 bg-charcoal-900 flex items-center justify-center shadow-[0_0_20px_rgba(205,166,95,0.1)] relative z-20"
                  >
                    <span className="font-serif italic text-gold-500 text-sm">{node.id}</span>
                  </motion.div>
                </div>

                {/* The Content */}
                <motion.div 
                  style={{ opacity }}
                  className={`w-full pl-24 md:pl-0 md:w-1/2 ${isEven ? 'md:text-left md:pr-12' : 'md:text-right md:pl-12'}`}
                >
                  <div className="p-6 border border-parchment-800/20 bg-[#b8ad98] shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-lg hover:border-charcoal-900/30 transition-colors">
                    <h3 className="font-mono text-charcoal-900 font-bold tracking-widest text-xs md:text-sm mb-3 uppercase">
                      {node.title}
                    </h3>
                    <p className="font-serif text-charcoal-800/90 text-lg md:text-xl leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
