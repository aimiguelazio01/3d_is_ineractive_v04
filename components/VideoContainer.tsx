import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoContainerProps {
  poster: string;
  videoUrl?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ poster, videoUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Glitch is active by default, disabled when hovered
  const isActive = !isHovered;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked by browser until interaction
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay to darken/tint if needed */}
      <div className={`absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-500 ${isHovered ? 'bg-transparent' : ''}`} />

      {/* Video Element with Glitch Filter */}
      <motion.div
        className="w-full h-full"
        style={{
          filter: isActive ? 'url(#glitch-vibe) contrast(1.1) brightness(1.1)' : 'contrast(1.0) brightness(1.0)',
          transition: 'filter 0.3s ease-out'
        }}
        animate={isHovered ? {
          y: [0, -15, 0],
          rotate: 0,
          scale: 1.05
        } : {
          y: 0,
          rotate: 0,
          scale: 1
        }}
        transition={{
          y: isHovered ? {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          } : { duration: 0.5 },
          rotate: { duration: 0.5, ease: "easeOut" },
          scale: { duration: 0.5, ease: "easeOut" }
        }}
      >
        <video
          ref={videoRef}
          className={`w-full h-full object-cover opacity-100`}
          style={{
            opacity: isHovered ? 1 : 0.3,
            transition: 'opacity 0.7s ease-out'
          }}
          muted
          loop
          playsInline
          poster={poster}
          preload="metadata"
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          <img
            src={poster}
            alt="Section visual"
            className="w-full h-full object-cover"
          />
        </video>
      </motion.div>

      {/* Glitch Overlays - Fade out on hover */}
      <div className={`scanlines pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-30' : 'opacity-0'}`} />
      <div
        className={`noise-bg pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-20' : 'opacity-0'}`}
      />

      {/* RGB Flash Effect (CSS Animated) - Only active when not hovered */}
      <div
        className={`absolute inset-0 bg-red-500 mix-blend-color-dodge pointer-events-none z-30 animate-flash-red ${isActive ? 'block' : 'hidden'}`}
      ></div>
      <div
        className={`absolute inset-0 bg-blue-500 mix-blend-exclusion pointer-events-none z-30 animate-flash-blue ${isActive ? 'block' : 'hidden'}`}
      ></div>

      {/* Halftone Effect */}
      <div
        className={`halftone absolute inset-0 transition-opacity duration-300 text-black ${isActive ? 'opacity-40' : 'opacity-0'}`}
      />

    </div>
  );
};

export default VideoContainer;