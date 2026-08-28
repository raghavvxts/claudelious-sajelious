import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const INVENTIONS = [
  {
    title: 'The Claude Machine',
    year: '1741',
    desc: 'A mysterious device capable of transforming human thought into increasingly complicated instructions. Historians later determined that the machine was actually a MacBook.'
  },
  {
    title: 'The Infinite Prompt',
    year: '1743',
    desc: 'Legend states that Sajelious once wrote a prompt so long that three scribes died copying it. The remainder has been lost to history.'
  },
  {
    title: 'The Automated Innovation Engine',
    year: '1747',
    desc: 'A device allegedly capable of generating inventions before Sajelious had even thought of them. Its operating principle: "Ask Claude."'
  }
];

export function InventionGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  return (
    <section ref={containerRef} className="py-48 w-full bg-transparent border-t border-gold-500/10">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-24">
          <h2 className="font-serif text-3xl md:text-5xl text-parchment-200 tracking-[0.2em] uppercase">
            The Great Inventions
          </h2>
          <div className="w-16 h-[1px] bg-gold-500/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 perspective-1000">
          {INVENTIONS.map((inv, i) => (
            <motion.div
              key={inv.title}
              initial={{ opacity: 0, rotateY: 20, y: 50 }}
              animate={isInView ? { opacity: 1, rotateY: 0, y: 0 } : {}}
              transition={{ duration: 1, delay: i * 0.2, type: "spring" }}
              className="group relative bg-[#b8ad98] border border-parchment-800/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center text-center transform-style-3d hover:-translate-y-4 hover:border-charcoal-900/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-500 cursor-pointer"
            >
              {/* Absurd hover state background */}
              <div className="absolute inset-0 bg-charcoal-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <p className="font-mono text-charcoal-900/60 font-bold tracking-[0.3em] text-xs mb-6">CIRC. {inv.year}</p>
              <h3 className="font-serif text-2xl md:text-3xl text-charcoal-900 mb-6 group-hover:text-burgundy-900 transition-colors">
                {inv.title}
              </h3>
              
              {/* Placeholder for an engraved illustration */}
              <div className="w-full aspect-square border border-charcoal-900/10 bg-transparent mb-8 flex items-center justify-center overflow-hidden">
                <div className="w-2/3 h-2/3 border border-charcoal-900/30 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-1000">
                  <div className="w-1/2 h-1/2 border border-charcoal-900/40 rotate-45" />
                </div>
              </div>

              <p className="font-sans font-medium text-charcoal-800/90 leading-relaxed text-sm">
                {inv.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
