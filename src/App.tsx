/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CustomCursor } from './components/CustomCursor';
import { HelloIntro } from './components/HelloIntro';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { ReadingProgressBar } from './components/ReadingProgressBar';

const loadSocialIdCards = () =>
  import('./components/SocialIdCardsSection').then((m) => ({
    default: m.SocialIdCardsSection,
  }));
const loadTechStackMarquee = () =>
  import('./components/TechStackMarquee').then((m) => ({
    default: m.TechStackMarquee,
  }));
const loadAboutSection = () =>
  import('./components/AboutSection').then((m) => ({
    default: m.AboutSection,
  }));
const loadProjectsSection = () =>
  import('./components/ProjectsSection').then((m) => ({
    default: m.ProjectsSection,
  }));
const loadTechnicalProficiency = () =>
  import('./components/TechnicalProficiencySection').then((m) => ({
    default: m.TechnicalProficiencySection,
  }));
const loadFavoriteProject = () =>
  import('./components/FavoriteProjectSection').then((m) => ({
    default: m.FavoriteProjectSection,
  }));
const loadTestimonialsSection = () =>
  import('./components/TestimonialsSection').then((m) => ({
    default: m.TestimonialsSection,
  }));
const loadComponentPlayground = () =>
  import('./components/ComponentPlaygroundSection').then((m) => ({
    default: m.ComponentPlaygroundSection,
  }));
const loadFooter = () =>
  import('./components/Footer').then((m) => ({
    default: m.Footer,
  }));

const SocialIdCardsSection = lazy(loadSocialIdCards);
const TechStackMarquee = lazy(loadTechStackMarquee);
const AboutSection = lazy(loadAboutSection);
const ProjectsSection = lazy(loadProjectsSection);
const TechnicalProficiencySection = lazy(loadTechnicalProficiency);
const FavoriteProjectSection = lazy(loadFavoriteProject);
const TestimonialsSection = lazy(loadTestimonialsSection);
const ComponentPlaygroundSection = lazy(loadComponentPlayground);
const Footer = lazy(loadFooter);

function PortfolioApp() {
  const { isDark } = useTheme();
  const [introDone, setIntroDone] = useState(false);

  const handleDoorsOpen = useCallback(() => {
    // Doors begin parting; underlying HeroSection is already mounted and painted.
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  // Preload below-the-fold section chunks cleanly after initial paint so scroll targets are ready immediately.
  useEffect(() => {
    const preload = () => {
      void loadSocialIdCards();
      void loadTechStackMarquee();
      void loadAboutSection();
      void loadProjectsSection();
      void loadTechnicalProficiency();
      void loadFavoriteProject();
      void loadTestimonialsSection();
      void loadComponentPlayground();
      void loadFooter();
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(preload, { timeout: 600 });
      return () => win.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(preload, 120);
    return () => window.clearTimeout(timer);
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

      <ReadingProgressBar />
      <Navbar />
      <main className="relative min-h-dvh w-full bg-[#ffffff] text-[#000000] transition-colors duration-300 dark:bg-[#000000] dark:text-[#ffffff]">
        <ParticleBackground variant={isDark ? 'dark' : 'light'} />
        <HeroSection />
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
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
