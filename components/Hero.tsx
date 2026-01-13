import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { TRANSLATIONS } from '../translations';
import HeroCanvas from './HeroCanvas';

interface HeroProps {
  lang: 'EN' | 'PT';
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const t = TRANSLATIONS[lang].hero;

  // Parallax for the whole hero content on scroll
  const yContent = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityContent = useTransform(scrollY, [0, 300], [1, 0]);

  // Responsive Mouse Parallax Logic
  const x = useSpring(0, { stiffness: 250, damping: 25 });
  const y = useSpring(0, { stiffness: 250, damping: 25 });

  const [isCenterHovered, setIsCenterHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalized coords (-1 to 1)
    const normalizedX = (clientX / innerWidth) * 2 - 1;
    const normalizedY = (clientY / innerHeight) * 2 - 1;

    // Check for center hover (distance < 0.4)
    const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
    setIsCenterHovered(distance < 0.4);

    const xPos = (clientX / innerWidth - 0.5) * 40; // range -20 to 20
    const yPos = (clientY / innerHeight - 0.5) * 40;
    x.set(xPos);
    y.set(yPos);
  };

  return (
    <section
      id="section_hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex items-center justify-center bg-dark-gradient md:cursor-none"
    >
      <HeroCanvas scrollY={scrollY} />
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      <motion.div
        className="relative z-10 text-center px-4 mix-blend-screen"
        animate={{
          scale: isCenterHovered ? 0.55 : 1.1,
          opacity: isCenterHovered ? 0.2 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: yContent,
          x,
          rotateX: y,
          rotateY: x,
          transformStyle: "preserve-3d",
          perspective: 1000
        }}
      >
        {/* Top Label */}
        <motion.div
          className="mb-6 flex justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.span
            className="text-[10px] tracking-[0.4em] font-mono text-concrete uppercase"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.system}
          </motion.span>
        </motion.div>

        {/* Main Title Staggered */}
        <h1
          className="w-[14.4vw] max-w-[288px] mx-auto flex justify-center overflow-visible"
          aria-label="MVFX"
          style={{ transform: "translateZ(140px) scale(0.75)" }}
        >
          <svg viewBox="200 100 1500 880" className="w-full h-auto overflow-visible drop-shadow-2xl">
            <defs>
              <linearGradient id="hero-logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#333333" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            {[
              "M424.86,291.14c1.02,11.16-1.19,22.28-1.85,33.37-10.01,168.36-21.31,336.76-33,505-1.58,22.77-1.36,47.42-4.13,69.87-5.95,48.25-44.76,75.11-92.37,69.61l-132.51-8.99,29.99-450.51c3.07-46.01,5.15-92.05,9-138,2.16-25.8,1.74-45,20.5-65.5,28.36-30.99,59.72-24.14,97.02-22,33.91,1.95,69.33,2.85,103,6.01,1.51.14,3,.47,4.35,1.14Z",
              "M697.96,325.03l105.96,386.54c12.5,42.4-11.69,85.42-53.92,96.94l-138.01,37.49-106.53-388.97c-9.29-44.84,10.39-80.02,53.52-94.54,38.91-13.1,87.6-25.49,127.79-35.21,1.88-.46,10.36-2.97,11.18-2.25Z",
              "M881.5,94.04l299.47,360.49c29.61,34.48,27.99,79.47-4.96,110.98l-111.66,92.4c-1.32.24-2.1-1.14-2.88-1.89-9.68-9.42-21.33-25.61-30.45-36.55-88.98-106.73-176.67-214.56-266-321-31.21-36.14-28.65-81.31,6.5-113.45l109.97-90.98Z",
              "M1054.06,849.09l280.39-154.14,167.05-583.95c10.52-43.7,52.14-64.24,94.87-54.88l161.66,19.34c1.55,1.16.46,1.27.22,2.26-1.35,5.49-3.04,11.03-4.54,16.49-67.07,244.01-136.55,487.45-204.95,731.05-11.58,29.34-31.64,48.25-58.74,63.26-82.44,45.64-171.49,83.3-254.34,128.66-42.39,18.03-77.87,6.18-102.49-31.87-27.56-42.59-49.97-88.88-77.36-131.64l-1.78-4.58Z"
            ].map((d, i) => {
              const duration = 2 + Math.random() * 2;
              return (
                <motion.path
                  key={i}
                  d={d}
                  initial={{
                    fill: "url(#hero-logo-gradient)",
                    y: 100,
                    opacity: 0,
                    filter: 'blur(10px)'
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    fill: ["#1a1a1a", "#333333", "#222222", "#2a2a2a", "#1a1a1a"]
                  }}
                  transition={{
                    y: { duration: 1.2, delay: 0.2 + (i * 0.15), ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 1.2, delay: 0.2 + (i * 0.15) },
                    filter: { duration: 1.2, delay: 0.2 + (i * 0.15) },
                    fill: {
                      duration: duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 2 + (i * 0.2)
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    filter: "brightness(1.5)",
                    transition: { duration: 0.2 }
                  }}
                />
              );
            })}
          </svg>
        </h1>

        {/* Subtitle / Spec - Deeper/Lower Z-axis */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2"
          style={{ transform: "translateZ(60px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.p
            className="text-sm md:text-base font-sans font-light text-concrete tracking-wide max-w-md uppercase"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[9px] uppercase tracking-widest text-concrete/60 animate-pulse">{t.scroll}</span>
        <motion.div
          className="w-[1px] h-12 bg-gradient-to-b from-concrete/0 via-concrete/50 to-concrete/0"
          animate={{ height: [0, 48, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;