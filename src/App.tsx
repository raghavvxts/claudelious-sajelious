import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MotionProvider } from './components/motion/MotionProvider';
import { Hero } from './components/sections/Hero';
import { Origin } from './components/sections/Origin';
import { SajeliousMind } from './components/sections/SajeliousMind';
import { ClaudeOracle } from './components/sections/ClaudeOracle';
import { SevenScrolls } from './components/sections/SevenScrolls';
import { InventionGallery } from './components/sections/InventionGallery';
import { Laboratory } from './components/sections/Laboratory';
import { GitArchive } from './components/sections/GitArchive';
import { SajeliousLaws } from './components/sections/SajeliousLaws';
import { Epitaph } from './components/sections/Epitaph';
import { PersistentPortrait } from './components/cinematic/PersistentPortrait';
import { AudioPlayer } from './components/cinematic/AudioPlayer';

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <MotionProvider>
      <AnimatePresence>
        {!entered && (
          <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="hidden md:flex fixed inset-0 z-[1000] bg-charcoal-950 flex-col items-center justify-center cursor-pointer"
            onClick={() => setEntered(true)}
          >
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }} 
              transition={{ duration: 3, repeat: Infinity }}
              className="font-serif text-xl md:text-2xl tracking-[0.3em] text-gold-500 border border-gold-500/30 px-12 py-6 hover:bg-gold-500/10 transition-colors"
            >
              ENTER THE ARCHIVES
            </motion.div>
            <p className="mt-8 font-mono text-[10px] text-parchment-200/40 uppercase tracking-[0.3em]">Audio Required</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`relative w-full overflow-clip bg-charcoal-900 min-h-screen font-sans selection:bg-gold-500 selection:text-charcoal-900 ${!entered ? "md:h-screen md:overflow-hidden" : ""}`}>
        
        {/* Global Cinematic Glassy Vignette (Spotlight Effect) */}
        <div className="fixed inset-0 pointer-events-none z-[45] bg-[radial-gradient(ellipse_at_center,rgba(205,166,95,0.08)_0%,transparent_30%,rgba(5,5,5,0.9)_100%)] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] mix-blend-overlay" />
        
        {/* Secondary soft light beam */}
        <div className="fixed inset-0 pointer-events-none z-[44] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
        
        <AudioPlayer />
        <Hero />
        <Origin />
        <SajeliousMind />
        <ClaudeOracle />
        <SevenScrolls />
        <InventionGallery />
        <Laboratory />
        <GitArchive />
        <SajeliousLaws />
        <Epitaph />
        
        <PersistentPortrait />
      </main>
    </MotionProvider>
  );
}

export default App;
