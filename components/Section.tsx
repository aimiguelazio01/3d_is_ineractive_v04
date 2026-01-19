import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants, useMotionValue, useMotionTemplate, AnimatePresence, useInView, useSpring } from 'framer-motion';
import { SectionData } from '../types';
import { INTEL_DATA } from '../constants';
import { TRANSLATIONS } from '../translations';
import VideoContainer from './VideoContainer';
import Section01Experience from './Section01Experience';


interface SectionProps {
  data: SectionData;
  index: number;
  lang: 'EN' | 'PT';
  onExpandChange?: (isExpanded: boolean) => void;
}

const Section: React.FC<SectionProps> = ({ data, index, lang, onExpandChange }) => {
  const t = TRANSLATIONS[lang];
  const sectionT = t.sections[data.id as keyof typeof t.sections];

  const renderTitle = (isSmall = false) => {
    return (
      <div className="w-full">
        {data.id === 'section_01' ? (
          <motion.h3
            className={`${isSmall ? 'text-3xl' : 'text-4xl md:text-6xl lg:text-6xl xl:text-[4.2vw]'} font-display font-semibold text-white leading-[1] tracking-tight uppercase cursor-pointer flex flex-col items-start gap-1`}
          >
            {sectionT.titleLines.map((word, wordIndex) => (
              <motion.div
                key={wordIndex}
                className="block whitespace-nowrap"
                initial={isSmall ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: isSmall ? 0 : wordIndex * 0.1 }}
              >
                <span className="chromatic-aberration">{word}</span>
              </motion.div>
            ))}
          </motion.h3>
        ) : data.id === 'section_02' ? (
          <motion.h3
            className={`${isSmall ? 'text-3xl' : 'text-4xl md:text-6xl lg:text-6xl xl:text-[4.6vw]'} font-display font-semibold text-white leading-[1] tracking-tight uppercase cursor-pointer flex flex-col items-start gap-2`}
          >
            {sectionT.titleLines.map((line, lineIndex) => (
              <motion.div
                key={lineIndex}
                className="block whitespace-nowrap"
                initial={isSmall ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: isSmall ? 0 : lineIndex * 0.2 }}
              >
                <span className="chromatic-aberration">{line}</span>
              </motion.div>
            ))}
          </motion.h3>
        ) : data.id === 'section_03' ? (
          <motion.h3
            className={`${isSmall ? 'text-4xl' : 'text-5xl md:text-7xl lg:text-7xl xl:text-[5.5vw]'} font-display font-semibold text-white leading-[0.9] tracking-tighter uppercase cursor-pointer flex flex-col items-start gap-0`}
          >
            {sectionT.titleLines.map((word, wordIndex) => (
              <div key={wordIndex} className="block relative group/word py-1">
                <div className="inline-flex">
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      className="inline-block relative"
                      initial={isSmall ? { opacity: 1 } : {
                        opacity: 0,
                        rotateY: -90,
                        z: -100,
                        x: -20,
                        filter: 'brightness(2) contrast(1.5)'
                      }}
                      whileInView={{
                        opacity: 1,
                        rotateY: 0,
                        z: 0,
                        x: 0,
                        filter: 'brightness(1) contrast(1)'
                      }}
                      transition={{
                        duration: 0.8,
                        delay: isSmall ? 0 : (wordIndex * 0.15) + (charIndex * 0.03),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      viewport={{ once: false }}
                    >
                      <motion.span
                        className="inline-block relative z-10 chromatic-aberration"
                      >
                        {char}
                      </motion.span>
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.h3>
        ) : data.id === 'section_05' ? (
          <motion.h3
            className={`${isSmall ? 'text-4xl' : 'text-5xl md:text-7xl lg:text-8xl xl:text-[6.5vw]'} font-display font-bold text-white leading-none tracking-tighter uppercase cursor-pointer flex flex-wrap items-start`}
          >
            {sectionT.titleLines.map((word, wordIndex) => (
              <div key={wordIndex} className="inline-flex mr-[0.3em] py-2">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    className="relative inline-block"
                    initial={isSmall ? "visible" : "hidden"}
                    whileInView="visible"
                    viewport={{ once: false }}
                  >
                    <motion.span
                      className="relative z-10 inline-block chromatic-aberration"
                      variants={{
                        hidden: { opacity: 0, scale: 1.5, y: 20 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            delay: isSmall ? 0 : (wordIndex * 0.2) + (charIndex * 0.05) + 0.4,
                            ease: "easeOut"
                          }
                        }
                      }}
                    >
                      {char}
                    </motion.span>
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.h3>
        ) : data.id === 'section_06' ? (
          <motion.h3
            className={`${isSmall ? 'text-4xl' : 'text-4xl md:text-7xl lg:text-8xl xl:text-[5.5vw]'} font-display font-bold text-white leading-[1.1] tracking-tight uppercase cursor-pointer flex flex-col items-start gap-2`}
          >
            {sectionT.titleLines.map((line, lineIndex) => (
              <div key={lineIndex} className="block whitespace-nowrap overflow-visible relative">
                <div className="inline-flex relative">
                  {line.split('').map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      className="inline-block relative"
                      initial={isSmall ? "visible" : "hidden"}
                      whileInView="visible"
                      viewport={{ once: false }}
                    >
                      <motion.span
                        className="relative z-20 inline-block text-white"
                        variants={{
                          hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.9 },
                          visible: {
                            opacity: 1,
                            filter: 'blur(0px)',
                            scale: 1,
                            transition: {
                              duration: 0.4,
                              delay: isSmall ? 0 : (lineIndex * 0.4) + (charIndex * 0.05) + 0.6,
                              ease: "easeOut"
                            }
                          }
                        }}
                      >
                        <span className="chromatic-aberration">
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      </motion.span>
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.h3>
        ) : data.id === 'section_04' ? (
          <motion.h3
            className={`${isSmall ? 'text-4xl' : 'text-4xl md:text-7xl lg:text-7xl xl:text-[5vw]'} font-display font-semibold text-white leading-[1] tracking-tight uppercase cursor-pointer flex flex-col items-start gap-2`}
          >
            {sectionT.titleLines.map((line, lineIndex) => (
              <motion.div
                key={lineIndex}
                className="block whitespace-nowrap"
                initial={isSmall ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: isSmall ? 0 : lineIndex * 0.2 }}
              >
                <span className="chromatic-aberration">{line}</span>
              </motion.div>
            ))}
          </motion.h3>
        ) : (
          <motion.h3
            className={`${isSmall ? 'text-4xl' : 'text-5xl md:text-7xl lg:text-9xl'} font-display font-semibold text-white leading-tight tracking-tight uppercase cursor-pointer transition-all duration-300 ${theme === 'glitch' ? 'hover:skew-x-12' : 'hover:tracking-widest'}`}
          >
            {sectionT.title.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-[0.3em] overflow-hidden">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "100%" },
                    visible: { y: 0, transition: { duration: 0.8, delay: i * 0.1, ease: animConfig.easing } }
                  }}
                  initial={isSmall ? "visible" : "hidden"}
                  whileInView="visible"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h3>
        )}
      </div>
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const isAlternate = index % 2 !== 0;
  const [hoveredIntel, setHoveredIntel] = useState<string | null>(null);
  const [intelOffset, setIntelOffset] = useState({ x: 0, y: 0 });
  const [pinnedPos, setPinnedPos] = useState({ left: '75%', top: '50%' });
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const isInView = useInView(containerRef, { margin: "-15%", once: false });

  // Auto-collapse when section goes out of view
  useEffect(() => {
    if (!isInView && isExpanded) {
      setIsExpanded(false);
    }
  }, [isInView, isExpanded]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleIntelHover = (item: string | null) => {
    if (item && item !== hoveredIntel) {
      if (data.id === 'section_04') {
        setPinnedPos({
          left: `${10 + Math.random() * 25}%`,
          top: `${20 + Math.random() * 60}%`
        });
      } else {
        // Random direction in 360 degrees
        const angle = Math.random() * Math.PI * 2;
        const distance = data.id === 'section_01' ? 60 : 110;
        setIntelOffset({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
    }
    setHoveredIntel(item);
  };

  // Define 4 distinct animation themes
  const THEMES = ['architect', 'glitch', 'liquid', 'cinematic'];
  const theme = THEMES[index % THEMES.length];

  // Derive pseudo-random values based on index to ensure consistency across renders
  const animConfig = useMemo(() => {
    switch (theme) {
      case 'architect':
        return {
          parallax: 15,
          stagger: 0.12,
          easing: [0.19, 1, 0.22, 1] as [number, number, number, number], // Expo out
          entry: { x: 0, y: 100, rotate: 0, scale: 1, blur: 0 },
          bgTextSkew: 0,
          lineSize: 80
        };
      case 'glitch':
        return {
          parallax: 8,
          stagger: 0.05,
          easing: [0.45, 0, 0.55, 1] as [number, number, number, number], // Stepped-ish ease
          entry: { x: -50, y: 0, rotate: 2, scale: 1.1, blur: 5 },
          bgTextSkew: 0,
          lineSize: 40
        };
      case 'liquid':
        return {
          parallax: 25,
          stagger: 0.2,
          easing: [0.68, -0.6, 0.32, 1.6] as [number, number, number, number], // Bouncy
          entry: { x: 0, y: 50, rotate: -5, scale: 0.8, blur: 0 },
          bgTextSkew: -5,
          lineSize: 120
        };
      case 'cinematic':
      default:
        return {
          parallax: 12,
          stagger: 0.15,
          easing: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // Smooth
          entry: { x: 0, y: 0, rotate: 0, scale: 1.05, blur: 20 },
          bgTextSkew: 0,
          lineSize: 60
        };
    }
  }, [theme]);

  // Parallax scroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Unique parallax for each section
  const yBg = useTransform(scrollYProgress, [0, 1], [`${-animConfig.parallax}%`, `${animConfig.parallax}%`]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const rotateContent = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -1 : 1, index % 2 === 0 ? 1 : -1]);

  // Mouse tracking for glow effect (Optimized for minimal latency)
  const mConfig = { damping: 50, stiffness: 4000, mass: 0.02 };
  const mouseX = useSpring(useMotionValue(0), mConfig);
  const mouseY = useSpring(useMotionValue(0), mConfig);
  const vMouseX = useSpring(useMotionValue(0), mConfig);
  const vMouseY = useSpring(useMotionValue(0), mConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    vMouseX.set(clientX);
    vMouseY.set(clientY);
  }

  const maskImage = useMotionTemplate`radial-gradient(${theme === 'glitch' ? '150px' : '350px'} circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  // Variants for content containers
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animConfig.stagger,
        delayChildren: 0.1,
      },
    },
  };

  // Specific reveal animations based on theme
  const getRevealVariants = (delayMult = 1): Variants => {
    switch (theme) {
      case 'architect':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              ease: animConfig.easing,
              delay: delayMult * 0.1
            }
          }
        };
      case 'glitch':
        return {
          hidden: { opacity: 0, x: -20, skewX: 20 },
          visible: {
            x: 0, opacity: 1, skewX: 0,
            transition: {
              duration: 0.4,
              ease: animConfig.easing,
              repeat: 2,
              repeatType: "reverse",
              repeatDelay: 0.05,
              delay: delayMult * 0.05
            }
          }
        };
      case 'liquid':
        return {
          hidden: { scale: 0.5, opacity: 0, rotate: -10 },
          visible: { scale: 1, opacity: 1, rotate: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } }
        };
      case 'cinematic':
        return {
          hidden: { opacity: 0, filter: 'blur(30px)', scale: 1.1 },
          visible: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 2, ease: 'easeOut' } }
        };
      default:
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    }
  };

  const itemVariants = getRevealVariants();

  return (
    <section
      id={data.id}
      ref={containerRef}
      className={`relative w-full min-h-screen md:h-screen flex flex-col overflow-hidden bg-black border-t border-white/5 ${isAlternate ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <motion.div
        className="w-full md:w-[40%] h-[50vh] md:h-full relative z-10 border-b md:border-b-0 md:border-r md:border-l border-white/5 overflow-hidden md:cursor-none"
        initial={{ opacity: 0, filter: theme === 'glitch' ? 'contrast(2) brightness(2)' : 'none' }}
        animate={{
          opacity: (isInView && !isExpanded) ? 1 : 0,
          filter: isExpanded ? 'blur(20px)' : 'none',
          x: isExpanded ? (isAlternate ? 100 : -100) : 0,
          pointerEvents: isExpanded ? 'none' : 'auto'
        }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <VideoContainer poster={data.videoPoster} videoUrl={data.videoUrl} />
      </motion.div>

      <div
        className={`w-full md:w-[60%] py-16 md:py-0 relative flex items-center ${isAlternate ? 'md:justify-center' : 'md:justify-start'} overflow-hidden group`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handleIntelHover(null)}
      >
        <AnimatePresence>
          {hoveredIntel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.15, // Faster entrance/exit
                opacity: { duration: 0.2 },
                scale: { type: "spring", stiffness: 300, damping: 25 }
              }}
              style={{
                left: isMobile ? '50%' : (data.id === 'section_04' ? pinnedPos.left : vMouseX),
                top: isMobile ? '50%' : (data.id === 'section_04' ? pinnedPos.top : vMouseY),
                x: isMobile ? 0 : (data.id === 'section_04' ? 0 : intelOffset.x),
                y: isMobile ? 0 : (data.id === 'section_04' ? 0 : intelOffset.y),
                translateX: '-50%',
                translateY: '-50%',
              }}
              className={`fixed z-[100] w-[90%] max-w-[320px] bg-[#0A0A0A]/60 border border-white/20 p-4 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col gap-4 overflow-y-auto max-h-[85vh] custom-scrollbar ${isMobile ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

              {/* Preview Media - 16:9 Ratio for better fit */}
              {(INTEL_DATA[hoveredIntel]?.image || INTEL_DATA[hoveredIntel]?.video) && (
                <div className="w-full aspect-video min-h-[150px] overflow-hidden border border-white/10 relative shrink-0">
                  {INTEL_DATA[hoveredIntel].video ? (
                    <video
                      key={INTEL_DATA[hoveredIntel].video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-700"
                    >
                      <source src={INTEL_DATA[hoveredIntel].video} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={INTEL_DATA[hoveredIntel].image}
                      alt={hoveredIntel}
                      className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>
              )}



              <div className="space-y-2">
                <h4 className="text-sm font-tech font-bold text-white tracking-widest uppercase truncate border-b border-white/10 pb-2">
                  {t.intel[hoveredIntel as keyof typeof t.intel]?.title || hoveredIntel}
                </h4>
                <p className="text-[11px] font-sans text-concrete leading-relaxed tracking-wide whitespace-pre-line">
                  {t.intel[hoveredIntel as keyof typeof t.intel]?.description || 'Accessing technical database...'}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2 pt-3 border-t border-white/5">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>

              {/* Decorative scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[50%] -translate-y-full hover:translate-y-full transition-transform duration-[2000ms] pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* BACKGROUND TEXT CONTAINER */}
        <motion.div
          style={{ y: yBg }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          {/* Base Layer */}
          <div className="absolute inset-0 flex flex-col justify-center items-center opacity-[0.03]">
            {sectionT.backgroundText.map((text, i) => (
              <motion.h2
                key={`base-${i}`}
                style={{ skewX: animConfig.bgTextSkew }}
                initial={
                  data.id === 'section_02' ? { opacity: 0, x: -100 } :
                    data.id === 'section_03' ? { opacity: 0, x: 100 } :
                      data.id === 'section_04' ? { opacity: 0, y: 50, filter: 'blur(10px)' } :
                        data.id === 'section_05' ? { opacity: 0, scale: 2, z: -500, rotateX: 45, rotateY: -30, filter: 'blur(20px)' } :
                          data.id === 'section_06' ? { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 50 } : {}
                }
                animate={
                  isInView ? (
                    data.id === 'section_02' ? { opacity: 1, x: 0 } :
                      data.id === 'section_03' ? { opacity: 1, x: 0 } :
                        data.id === 'section_04' ? { opacity: 1, y: 0, filter: 'blur(0px)' } :
                          data.id === 'section_05' ? { opacity: 1, scale: 1, z: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' } :
                            data.id === 'section_06' ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { opacity: 1 }
                  ) : { opacity: 0 }
                }
                transition={
                  (data.id === 'section_02' || data.id === 'section_03' || data.id === 'section_04' || data.id === 'section_05' || data.id === 'section_06')
                    ? { duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' } : {}
                }
                viewport={{ once: false }}
                className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-white whitespace-nowrap"
              >
                {text}
              </motion.h2>
            ))}
          </div>

          {/* Glow Layer (Masked) */}
          <motion.div
            className={`absolute inset-0 hidden md:flex flex-col justify-center items-center ${(data.id === 'section_03' || data.id === 'section_04' || data.id === 'section_05' || data.id === 'section_06') ? 'opacity-15' : 'opacity-30'}`}
            style={{
              WebkitMaskImage: maskImage,
              maskImage: maskImage
            }}
          >
            {sectionT.backgroundText.map((text, i) => (
              <motion.h2
                key={`glow-${i}`}
                style={{ skewX: animConfig.bgTextSkew }}
                initial={
                  data.id === 'section_02' ? { opacity: 0, x: -100 } :
                    data.id === 'section_03' ? { opacity: 0, x: 100 } :
                      data.id === 'section_04' ? { opacity: 0, y: 50, filter: 'blur(10px)' } :
                        data.id === 'section_05' ? { opacity: 0, scale: 2, z: -500, rotateX: 45, rotateY: -30, filter: 'blur(20px)' } :
                          data.id === 'section_06' ? { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 50 } : {}
                }
                animate={
                  isInView ? (
                    data.id === 'section_02' ? { opacity: 1, x: 0 } :
                      data.id === 'section_03' ? { opacity: 1, x: 0 } :
                        data.id === 'section_04' ? { opacity: 1, y: 0, filter: 'blur(0px)' } :
                          data.id === 'section_05' ? { opacity: 1, scale: 1, z: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' } :
                            data.id === 'section_06' ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { opacity: 1 }
                  ) : { opacity: 0 }
                }
                transition={
                  (data.id === 'section_02' || data.id === 'section_03' || data.id === 'section_04' || data.id === 'section_05' || data.id === 'section_06')
                    ? { duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' } : {}
                }
                viewport={{ once: false }}
                className={`text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-white whitespace-nowrap ${theme === 'glitch' ? 'drop-shadow-[0_0_10px_rgba(255,0,255,0.7)]' : 'drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]'}`}
              >
                {text}
              </motion.h2>
            ))}
          </motion.div>

          {/* Lighting Layer (Section 02 exclusive sweep) */}
          {data.id === 'section_02' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden opacity-20">
              {sectionT.backgroundText.map((text, i) => (
                <div key={`light-wrap-${i}`} className="relative">
                  {/* Base Text with Gradient Sweep */}
                  <motion.h2
                    className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:300%_100%]"
                    animate={{
                      backgroundPosition: ["150% 0", "-150% 0"]
                    }}
                    transition={{
                      backgroundPosition: {
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1 + i * 0.5
                      }
                    }}
                  >
                    {text}
                  </motion.h2>
                </div>
              ))}
            </div>
          )}

          {/* Lighting Layer (Section 03 exclusive scanner) */}
          {data.id === 'section_03' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden opacity-15">
              {sectionT.backgroundText.map((text, i) => (
                <div key={`scanner-wrap-${i}`} className="relative group">
                  {/* The Scanning Bar Text */}
                  <motion.h2
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-transparent via-white/80 to-transparent bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ["-100% 0", "100% 0"]
                    }}
                    transition={{
                      x: { duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' },
                      opacity: { duration: 1, delay: 0.2 + i * 0.1 },
                      backgroundPosition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 1 + i * 0.8
                      }
                    }}
                  >
                    {text}
                  </motion.h2>

                  {/* High-frequency Data Flicker (Simplified) */}
                  <motion.h2
                    animate={{
                      opacity: [0, 0.4, 0, 0.2, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className="absolute inset-0 text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-white/5 whitespace-nowrap pointer-events-none"
                  >
                    {text}
                  </motion.h2>

                  {/* Vertical Scanner Accent */}
                  <motion.div
                    className="absolute inset-y-0 w-[2px] bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 pointer-events-none"
                    animate={{
                      left: ["-10%", "110%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.2, 1],
                      delay: 1 + i * 0.8
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Lighting Layer (Section 04 exclusive neural pulse) */}
          {data.id === 'section_04' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden opacity-15">
              {sectionT.backgroundText.map((text, i) => (
                <div key={`neural-wrap-${i}`} className="relative">
                  <motion.h2
                    initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-transparent via-white/50 to-transparent bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ["0% 0", "200% 0"],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      x: { duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' },
                      backgroundPosition: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      },
                      opacity: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3
                      }
                    }}
                  >
                    {text}
                  </motion.h2>

                  {/* Neural Spark Layer (Simplified to words instead of characters) */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <h2 className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-white/5 whitespace-nowrap pointer-events-none">
                      {text}
                    </h2>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
          {/* Lighting Layer (Section 05 exclusive prismatic grid) */}
          {data.id === 'section_05' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden opacity-15">
              {sectionT.backgroundText.map((text, i) => (
                <div key={`grid-wrap-${i}`} className="relative group">
                  {/* Prismatic Mesh Shimmer */}
                  <motion.h2
                    initial={{ opacity: 0, scale: 1.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_rgba(255,255,255,0.8)_0%,_transparent_50%)] bg-[length:200%_200%]"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {text}
                  </motion.h2>

                  {/* Intersecting Pulse Beams */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                      className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10"
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                    />
                    <motion.div
                      className="absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-rose-400 to-transparent shadow-[0_0_15px_rgba(244,63,94,0.5)] z-10"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
                    />
                  </div>

                  {/* simplified mesh vertex points */}
                  <div className="absolute inset-0 flex flex-wrap justify-between items-center opacity-10">
                    {[...Array(6)].map((_, j) => (
                      <motion.div
                        key={j}
                        className="w-1 h-1 bg-white rounded-full"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: j * 0.5 }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Lighting Layer (Section 06 exclusive UV curing bed) */}
          {data.id === 'section_06' && (
            <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden opacity-15">
              {sectionT.backgroundText.map((text, i) => (
                <div key={`fabrication-wrap-${i}`} className="relative group">
                  {/* UV Scanning Mesh */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[12vw] md:text-[8vw] lg:text-[10vw] font-tech font-bold leading-[0.85] tracking-tight text-transparent whitespace-nowrap bg-clip-text bg-[linear-gradient(90deg,_transparent_0%,_rgba(168,85,247,0.8)_50%,_transparent_100%)] bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ["100% 0%", "-100% 0%"]
                    }}
                    transition={{
                      backgroundPosition: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }
                    }}
                  >
                    {text}
                  </motion.h2>

                  {/* High-speed Laser Paths */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, lIdx) => (
                      <motion.div
                        key={lIdx}
                        className="absolute bg-white shadow-[0_0_10px_#fff]"
                        style={{
                          width: Math.random() * 20 + 10,
                          height: 1,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`
                        }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scaleX: [0, 1.5, 0],
                          x: [0, 100, 0]
                        }}
                        transition={{
                          duration: 0.8 + Math.random(),
                          repeat: Infinity,
                          delay: Math.random() * 3
                        }}
                      />
                    ))}
                  </div>

                  {/* Fabrication Hotspots (Simplified count) */}
                  <div className="absolute inset-0 flex flex-wrap justify-around items-center opacity-20">
                    {[...Array(4)].map((_, hIdx) => (
                      <motion.div
                        key={hIdx}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.4, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: hIdx * 0.5
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* FOREGROUND CONTENT */}
        <motion.div
          style={{ y: yContent, rotate: theme === 'architect' ? 0 : rotateContent }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: isMobile ? "-5%" : "-15%" }}
          className={`relative z-20 w-full max-w-2xl ${isAlternate ? 'md:px-20' : 'md:pl-20 md:pr-8'} px-8 flex flex-col gap-6 md:gap-10`}
        >
          {/* Main Title / Section Index Transition Block */}
          {!isExpanded ? (
            <motion.div
              layoutId={`section-title-${data.id}`}
              className="w-full origin-left flex flex-col gap-4"
            >
              {/* Section Index Indicator */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: animConfig.lineSize }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-[1px] bg-concrete"
                />
                <span className="text-xs font-mono text-concrete">0{index + 1}</span>
              </motion.div>

              <div className="w-full">
                {renderTitle()}
              </div>
            </motion.div>
          ) : (
            <div className="h-32 w-full" />
          )}

          {/* Capability List */}
          <motion.ul
            animate={{ opacity: isExpanded ? 0 : 1, x: isExpanded ? -20 : 0, pointerEvents: isExpanded ? 'none' : 'auto' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 border-l-2 border-white/20 pl-6"
          >
            {data.description.map((item, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                onMouseEnter={() => handleIntelHover(item)}
                onMouseLeave={() => handleIntelHover(null)}
                whileHover={{ x: 15, color: "#fff", transition: { duration: 0.2 } }}
                className="text-xs md:text-sm lg:text-base font-sans font-light tracking-wider text-concrete uppercase cursor-pointer"
              >
                {t.intel[item as keyof typeof t.intel]?.title || item}
              </motion.li>
            ))}
          </motion.ul>

          {/* Interaction Toggle Button - Local Placeholder */}
          {!isExpanded && (
            <motion.div
              layoutId={`interaction-button-${data.id}`}
              onClick={() => setIsExpanded(true)}
              className="mt-8 md:mt-12 pointer-events-auto flex items-center gap-6 group cursor-pointer w-fit"
            >
              <motion.div
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:border-white/50 bg-white/5 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`bg-white rounded-full ${theme === 'glitch' ? 'w-full h-[1px]' : 'w-1.5 h-1.5'}`}
                  animate={theme === 'glitch' ? { opacity: [0, 1, 0] } : { scale: [1, 1.8, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: isMobile ? 0.8 : 0.5, x: 0 } : { opacity: 0, x: -10 }}
                whileHover={!isMobile ? { opacity: 1, x: 5 } : {}}
                transition={{ duration: 0.8 }}
                className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white uppercase pointer-events-none"
              >
                {t.ui?.enterExperience || "ENTER EXPERIENCE"}
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        {/* Grid Overlay */}
        <div className={`absolute inset-0 z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none ${theme === 'glitch' ? 'opacity-[0.4]' : 'opacity-[0.15]'}`}></div>
      </div>

      {/* Corner Overlay - Outside of transforms for Title and Button */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {data.id === 'section_01' && <Section01Experience />}
            {/* Expanded Title & Index */}

            <motion.div
              layoutId={`section-title-${data.id}`}
              style={{
                position: 'absolute',
                top: isMobile ? '60px' : '100px',
                left: isMobile ? '44px' : '60px',
                right: 'auto',
                width: isMobile ? '80%' : '45%',
                zIndex: 3001,
                opacity: 0.8,
                transformOrigin: 'left top'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none flex flex-col gap-4"
            >
              {/* Section Index Indicator (Expanded Mode) */}
              <div className="flex items-center gap-4 opacity-60 scale-75 origin-left">
                <div
                  className="h-[1px] bg-concrete"
                  style={{ width: isMobile ? '30px' : '50px' }}
                />
                <span className="text-xs font-mono text-concrete">0{index + 1}</span>
              </div>
              <div>
                {renderTitle(true)}
              </div>
            </motion.div>

            {/* Expanded Toggle Button */}
            <motion.div
              layoutId={`interaction-button-${data.id}`}
              style={{
                position: 'absolute',
                top: isMobile ? '220px' : '320px',
                left: isMobile ? '44px' : '60px',
                right: 'auto',
                zIndex: 3000
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto flex items-center gap-6 group cursor-pointer"
            >
              <motion.div
                onClick={() => setIsExpanded(false)}
                className="w-12 h-12 rounded-full border border-white flex items-center justify-center cursor-pointer bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] rotate-45 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`bg-white rounded-full ${theme === 'glitch' ? 'w-full h-[1px]' : 'w-1.5 h-1.5'} scale-[1.5]`} />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white uppercase pointer-events-none"
              >
                {t.ui?.exitExperience || "EXIT EXPERIENCE"}
              </motion.span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Section;