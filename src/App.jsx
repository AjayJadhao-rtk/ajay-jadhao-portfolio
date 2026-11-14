import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import HeroSection from './components/HeroSection';
import WorldExplorationView from './components/WorldExplorationView';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [viewMode, setViewMode] = useState('hero'); // 'hero' | '3d_world'

  return (
    <div className="w-full min-h-screen bg-[#E9DDC7] overflow-x-clip">
      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 pointer-events-auto"
          >
            <WelcomeScreen
              onEnter={() => {
                setHasEntered(true);
                setViewMode('hero');
              }}
              onEnter3DWorld={() => {
                setHasEntered(true);
                setViewMode('3d_world');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Switching with Fluid, Hardware-Accelerated Crossfade */}
      <AnimatePresence mode="wait">
        {viewMode === 'hero' ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <HeroSection
              onOpen3DWorld={() => setViewMode('3d_world')}
              currentView={viewMode}
              onToggleView={setViewMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <WorldExplorationView onReturnToHero={() => setViewMode('hero')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
