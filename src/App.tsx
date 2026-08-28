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
  return (
    <MotionProvider>
      <main className="relative w-full overflow-clip bg-charcoal-900 min-h-screen font-sans selection:bg-gold-500 selection:text-charcoal-900">
        
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
