import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

const COMMITS = [
  { year: 'OCT 1743', msg: 'INITIAL INVENTION', note: 'The first attempt. It worked, but it was ugly.' },
  { year: 'NOV 1743', msg: 'FIX INVENTION', note: 'It did not actually work.' },
  { year: 'FEB 1744', msg: 'IMPROVE INVENTION', note: 'Added brass.' },
  { year: 'AUG 1745', msg: 'MAKE IT MORE CINEMATIC', note: 'The beginning of what historians now call "The Escalation."' },
  { year: 'MAR 1747', msg: 'CLAUDE SUGGESTED SOMETHING BETTER', note: 'A humbling moment for Sajelious.' },
  { year: 'APR 1748', msg: 'REWRITE ENTIRE INVENTION', note: 'Three weeks of work deleted in a single prompt.' },
  { year: 'MAY 1748', msg: 'FIX PREVIOUS FIX', note: 'Regression testing was not yet invented.' },
  { year: 'DEC 1750', msg: 'ONE LAST CHANGE', note: 'It was not the last change.' },
  { year: 'JAN 1752', msg: 'ONE FINAL FINAL CHANGE', note: 'Still not the last change.' },
  { year: 'SEP 1755', msg: 'ACTUALLY REVERT', note: 'Sajelious realizes his hubris.' },
  { year: 'NOV 1760', msg: 'CLAUDE DID IT', note: 'The ultimate acceptance.' }
];

export function GitArchive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  const [hoveredCommit, setHoveredCommit] = useState<number | null>(null);

  return (
    <section ref={containerRef} className="py-32 w-full bg-transparent">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        <div className="text-center mb-24">
          <h2 className="font-serif text-3xl md:text-5xl text-gold-500 uppercase tracking-widest text-center mb-16">
            The Git Archive
          </h2>
          <div className="w-24 h-[2px] bg-gold-500 mx-auto mb-6" />
          <p className="font-sans font-light text-parchment-200/60 uppercase tracking-[0.2em] text-sm">
            Recovered Archival Logs
          </p>
        </div>

        <div className="relative border-l-2 border-gold-500/20 ml-4 md:ml-12 pl-8 md:pl-12 flex flex-col gap-12">
          {COMMITS.map((commit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCommit(i)}
              onMouseLeave={() => setHoveredCommit(null)}
            >
              {/* Commit Node */}
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-charcoal-900 border-2 border-gold-500/50 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors shadow-[0_0_10px_rgba(205,166,95,0.2)]" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                <span className="font-mono text-parchment-200/40 text-sm">{commit.year}</span>
                <span className="font-mono text-parchment-200 group-hover:text-gold-500 transition-colors font-bold tracking-wide">
                  {commit.msg}
                </span>
              </div>

              {/* Historical Note Tooltip */}
              <motion.div 
                initial={false}
                animate={{ 
                  opacity: hoveredCommit === i ? 1 : 0, 
                  height: hoveredCommit === i ? 'auto' : 0,
                  marginTop: hoveredCommit === i ? '12px' : '0px'
                }}
                className="overflow-hidden"
              >
                <div className="bg-charcoal-900 text-parchment-200 p-4 rounded-sm border-l-2 border-gold-500 font-serif italic text-sm">
                  "{commit.note}"
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
