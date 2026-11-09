import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import WorldExplorationView from './components/WorldExplorationView';

export default function App() {
  const [viewMode, setViewMode] = useState('hero'); // 'hero' | '3d_world'

  return (
    <div className="w-full min-h-screen bg-[#E9DDC7]">
      {viewMode === 'hero' ? (
        <HeroSection
          onOpen3DWorld={() => setViewMode('3d_world')}
          currentView={viewMode}
          onToggleView={setViewMode}
        />
      ) : (
        <WorldExplorationView onReturnToHero={() => setViewMode('hero')} />
      )}
    </div>
  );
}
