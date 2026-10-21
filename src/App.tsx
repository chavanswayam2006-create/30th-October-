import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LevelMapScreen } from './screens/LevelMapScreen';
import { MemoryLaneScreen } from './screens/MemoryLaneScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { CinemaScreen } from './screens/CinemaScreen';
import { SongsScreen } from './screens/SongsScreen';
import { GamesScreen } from './screens/GamesScreen';
import { LettersScreen } from './screens/LettersScreen';
import { ReasonsScreen } from './screens/ReasonsScreen';
import { FinaleScreen } from './screens/FinaleScreen';

// Automatically scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/level-map" element={<LevelMapScreen />} />
        <Route path="/memory-lane" element={<MemoryLaneScreen />} />
        <Route path="/photo-gallery" element={<GalleryScreen />} />
        <Route path="/our-cinema" element={<CinemaScreen />} />
        <Route path="/songs-of-us" element={<SongsScreen />} />
        <Route path="/games-hub" element={<GamesScreen />} />
        <Route path="/open-when-letters" element={<LettersScreen />} />
        <Route path="/20-reasons" element={<ReasonsScreen />} />
        <Route path="/finale" element={<FinaleScreen />} />
        {/* Fallback to welcome screen */}
        <Route path="*" element={<WelcomeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
