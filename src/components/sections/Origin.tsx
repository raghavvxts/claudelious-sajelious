import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function Origin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate opacity for each line based on scroll progress
  // The section is very tall so we have plenty of scroll depth to reveal each line
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.1, 0.15, 0.8], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.25, 0.3, 0.8], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.3, 0.4, 0.45, 0.8], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.45, 0.55, 0.6, 0.8], [0, 1, 1, 0]);
  
  const opacity5 = useTransform(scrollYProgress, [0.65, 0.75, 0.8, 0.9], [0, 1, 1, 0]);
  
  // The giant WHY
  const scaleWhy = useTransform(scrollYProgress, [0.85, 0.95], [0.7, 1]);
  const opacityWhy = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-transparent">
      
      {/* Liquid Ink Transition from Hero */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-charcoal-900 to-transparent z-10" />

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWExYTFhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjY2RhNjVmIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiI+PC9wYXRoPgo8L3N2Zz4=')] mix-blend-overlay pointer-events-none" />

        {/* The Buildup */}
        <div className="relative z-10 w-full max-w-4xl px-6 mx-auto text-center font-serif text-2xl md:text-4xl lg:text-5xl text-parchment-200/90 leading-relaxed flex flex-col gap-4">
          <motion.p style={{ opacity: opacity1 }}>
            In an age without artificial intelligence...
          </motion.p>
          <motion.p style={{ opacity: opacity2 }} className="text-gold-500/80 italic">
            without automated code generation...
          </motion.p>
          <motion.p style={{ opacity: opacity3 }}>
            without GitHub...
          </motion.p>
          <motion.p style={{ opacity: opacity4 }} className="text-gold-500/80 italic">
            without Stack Overflow...
          </motion.p>
          
          <motion.p style={{ opacity: opacity5 }} className="font-bold tracking-wide mt-4">
            ...one man asked the question that would change history.
          </motion.p>
        </div>

        {/* The Giant WHY */}
        <motion.div 
          style={{ opacity: opacityWhy, scale: scaleWhy }}
          className="absolute z-20 w-full flex justify-center items-center pointer-events-none"
        >
          <h2 className="font-serif italic text-[20vw] md:text-[25vw] leading-none text-gold-500 drop-shadow-[0_0_100px_rgba(205,166,95,0.3)]">
            “WHY?”
          </h2>
        </motion.div>

      </div>
    </section>
  );
}
