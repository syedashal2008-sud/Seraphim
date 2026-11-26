/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AboutSection } from './components/AboutSection';
import { CustomCursor } from './components/CustomCursor';
import { FavoriteProjectSection } from './components/FavoriteProjectSection';
import { Footer } from './components/Footer';
import { HelloIntro } from './components/HelloIntro';
import { HeroSection } from './components/HeroSection';
import { ComponentPlaygroundSection } from './components/ComponentPlaygroundSection';
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { ProjectsSection } from './components/ProjectsSection';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { SocialIdCardsSection } from './components/SocialIdCardsSection';
import { TechStackMarquee } from './components/TechStackMarquee';
import { TechnicalProficiencySection } from './components/TechnicalProficiencySection';
import { TestimonialsSection } from './components/TestimonialsSection';

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

function PortfolioApp() {
  const { isDark } = useTheme();
  const [siteStarted, setSiteStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const handleDoorsOpen = useCallback(() => {
    setSiteStarted(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />

      {!introDone && (
        <HelloIntro
          onDoorsOpen={handleDoorsOpen}
          onComplete={handleIntroComplete}
        />
      )}

      {siteStarted && (
        <>
          <ReadingProgressBar />
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
            className="relative min-h-dvh w-full bg-[#ffffff] text-[#000000] transition-colors duration-300 dark:bg-[#000000] dark:text-[#ffffff]"
          >
            <ParticleBackground variant={isDark ? 'dark' : 'light'} />
            <HeroSection />
            <SocialIdCardsSection />
            <TechStackMarquee />
            <AboutSection />
            <ProjectsSection />
            <TechnicalProficiencySection />
            <TechStackMarquee />
            <FavoriteProjectSection />
            <TestimonialsSection />
            <ComponentPlaygroundSection />
            <Footer />
          </motion.main>
        </>
      )}
    </MotionConfig>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
