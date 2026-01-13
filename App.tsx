import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Section from './components/Section';
import WorksIndex from './components/WorksIndex';
import CustomCursor from './components/CustomCursor';
import SvgFilters from './components/SvgFilters';
import { SECTIONS } from './constants';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  const [isIndexVisible, setIsIndexVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [lang, setLang] = useState<'EN' | 'PT'>('EN');
  const [isAnySectionExpanded, setIsAnySectionExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8;
      setIsIndexVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black md:cursor-none">
      <SvgFilters />
      <CustomCursor />

      {/* Fixed UI - Hidden on Hero or when a section is expanded */}
      <WorksIndex isVisible={isIndexVisible && !isAnySectionExpanded} activeSectionId={activeSectionId} lang={lang} />

      {/* Header / Logo Fixed */}
      <motion.header
        className="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference pointer-events-none"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center">
          <div className="cursor-pointer pointer-events-auto group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <motion.svg
              viewBox="0 0 1920 1080"
              className="h-8 md:h-10 w-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <g fill="#808080" className="transition-opacity group-hover:opacity-80">
                <path d="M424.86,291.14c1.02,11.16-1.19,22.28-1.85,33.37-10.01,168.36-21.31,336.76-33,505-1.58,22.77-1.36,47.42-4.13,69.87-5.95,48.25-44.76,75.11-92.37,69.61l-132.51-8.99,29.99-450.51c3.07-46.01,5.15-92.05,9-138,2.16-25.8,1.74-45,20.5-65.5,28.36-30.99,59.72-24.14,97.02-22,33.91,1.95,69.33,2.85,103,6.01,1.51.14,3,.47,4.35,1.14Z" />
                <path d="M697.96,325.03l105.96,386.54c12.5,42.4-11.69,85.42-53.92,96.94l-138.01,37.49-106.53-388.97c-9.29-44.84,10.39-80.02,53.52-94.54,38.91-13.1,87.6-25.49,127.79-35.21,1.88-.46,10.36-2.97,11.18-2.25Z" />
                <path d="M881.5,94.04l299.47,360.49c29.61,34.48,27.99,79.47-4.96,110.98l-111.66,92.4c-1.32.24-2.1-1.14-2.88-1.89-9.68-9.42-21.33-25.61-30.45-36.55-88.98-106.73-176.67-214.56-266-321-31.21-36.14-28.65-81.31,6.5-113.45l109.97-90.98Z" />
                <path d="M1054.06,849.09l280.39-154.14,167.05-583.95c10.52-43.7,52.14-64.24,94.87-54.88l161.66,19.34c1.55,1.16.46,1.27.22,2.26-1.35,5.49-3.04,11.03-4.54,16.49-67.07,244.01-136.55,487.45-204.95,731.05-11.58,29.34-31.64,48.25-58.74,63.26-82.44,45.64-171.49,83.3-254.34,128.66-42.39,18.03-77.87,6.18-102.49-31.87-27.56-42.59-49.97-88.88-77.36-131.64l-1.78-4.58Z" />
              </g>
            </motion.svg>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 pointer-events-auto items-center">
            {[
              { label: t.nav.expertise, key: 'expertise' },
              { label: t.nav.about, key: 'about' },
              { label: t.nav.contact, key: 'contact' }
            ].map((item, i) => (
              <motion.span
                key={item.key}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (i * 0.1) }}
                className="text-xs font-mono uppercase tracking-widest text-concrete hover:text-white cursor-pointer transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </motion.span>
            ))}

            {/* Language Toggle (Desktop) */}
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              onClick={() => setLang(prev => prev === 'EN' ? 'PT' : 'EN')}
              className="text-xs font-mono uppercase tracking-widest text-concrete hover:text-white cursor-pointer transition-colors relative group w-6 text-center"
            >
              {lang}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </motion.span>
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden flex items-center gap-4 pointer-events-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="text-[10px] font-mono tracking-widest text-concrete uppercase">
              {isMenuOpen ? (lang === 'EN' ? 'Close' : 'Fechar') : (lang === 'EN' ? 'Menu' : 'Menu')}
            </div>
            <div className="relative w-6 h-4 group cursor-pointer transition-transform duration-300 active:scale-90">
              <span className={`absolute left-0 w-full h-[1px] bg-white transition-all duration-300 ease-out ${isMenuOpen ? 'top-2 rotate-45' : 'top-0'}`}></span>
              <span className={`absolute left-0 w-full h-[1px] bg-white transition-opacity duration-300 top-2 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute left-0 w-full h-[1px] bg-white transition-all duration-300 ease-out ${isMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`}></span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 min-h-screen bg-black z-[45] flex flex-col justify-center p-8 md:hidden"
          >
            <div className="flex flex-col gap-12 max-w-sm mx-auto w-full">
              {[
                { label: t.nav.expertise, key: 'expertise' },
                { label: t.nav.about, key: 'about' },
                { label: t.nav.contact, key: 'contact' }
              ].map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.1), ease: "easeOut" }}
                  className="text-5xl font-display font-bold text-white uppercase tracking-tighter hover:opacity-50 transition-opacity cursor-pointer flex items-center gap-6 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xs font-mono text-concrete group-hover:text-white transition-colors">0{i + 1}</span>
                  {item.label}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-12 border-t border-white/10 flex justify-between items-center"
              >
                <div
                  className="text-concrete hover:text-white font-mono text-sm tracking-widest cursor-pointer flex items-center gap-3 transition-colors"
                  onClick={() => {
                    setLang(prev => prev === 'EN' ? 'PT' : 'EN');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className={lang === 'PT' ? 'text-white' : 'opacity-40'}>PT-BR</span>
                  <span className="text-[10px] opacity-20">/</span>
                  <span className={lang === 'EN' ? 'text-white' : 'opacity-40'}>ENGLISH</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero lang={lang} />

        <div className="relative z-10">
          {SECTIONS.map((section, index) => (
            <Section
              key={section.id}
              data={section}
              index={index}
              lang={lang}
              onExpandChange={setIsAnySectionExpanded}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="w-full py-24 bg-black border-t border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-tech text-xs tracking-[0.2em] text-concrete uppercase mb-2 relative z-10"
          >
            © {new Date().getFullYear()} {t.footer.copyright}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-mono text-[10px] text-concrete/40 relative z-10"
          >
            {t.footer.tagline}
          </motion.p>
        </footer>
      </main>
    </div>
  );
};

export default App;