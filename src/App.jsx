import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import HeroSection from './components/HeroSection';
import WorldExplorationView from './components/WorldExplorationView';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [viewMode, setViewMode] = useState('hero'); // 'hero' | '3d_world'

  return (
    <div className="w-full min-h-screen bg-[#E9DDC7]">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50"
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
        ) : viewMode === 'hero' ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.5 }}
          >
            <WorldExplorationView onReturnToHero={() => setViewMode('hero')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
