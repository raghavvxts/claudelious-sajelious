import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const LAWS = [
  "I. EVERY PROBLEM CAN BE SOLVED.",
  "II. EVERY SOLUTION CAN BE IMPROVED.",
  "III. EVERY IMPROVEMENT REQUIRES ANOTHER PROMPT.",
  "IV. CLAUDE MUST BE CONSULTED.",
  "V. THERE IS ALWAYS ONE MORE CHANGE.",
  "VI. THE FIRST VERSION IS NEVER THE FINAL VERSION.",
  "VII. MAKE IT MORE CINEMATIC."
];

export function SajeliousLaws() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <section ref={containerRef} className="py-48 w-full bg-transparent flex flex-col items-center justify-center border-t border-charcoal-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative">
      
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-charcoal-900/50 mix-blend-multiply pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-32 z-10"
      >
        <h2 className="font-serif text-2xl md:text-4xl text-gold-500 tracking-[0.5em] uppercase mb-6">
          The Sajelious Method
        </h2>
        <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto" />
      </motion.div>

      <div className="max-w-4xl w-full px-6 flex flex-col gap-32 md:gap-[20vh] text-center z-10 pb-32">
        {LAWS.map((law, i) => (
          <motion.h3
            key={i}
            initial={{ opacity: 0, filter: 'blur(20px)', y: 40 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`font-serif text-3xl md:text-5xl lg:text-6xl uppercase tracking-widest leading-tight ${i === LAWS.length - 1 ? 'text-gold-400 drop-shadow-[0_0_20px_rgba(205,166,95,0.5)]' : 'text-parchment-200/80'}`}
          >
            {law}
          </motion.h3>
        ))}
      </div>

    </section>
  );
}
