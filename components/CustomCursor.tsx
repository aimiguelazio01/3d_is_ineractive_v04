import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-responsive config for zero-lag feeling
  const springConfig = { damping: 55, stiffness: 5000, mass: 0.05 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.documentElement.classList.contains('modal-open'));
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    checkModal();

    const moveCursor = (e: MouseEvent) => {
      // Center based on default size
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('.cursor-pointer') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[3000] mix-blend-difference hidden md:flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        className="bg-white rounded-full"
        animate={{
          width: isHovering ? 48 : 12,
          height: isHovering ? 48 : 12,
          opacity: isHovering ? 0.2 : 1
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      {isHovering && (
        <motion.div
          className="absolute inset-0 border border-white rounded-full"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.div>
  );
};

export default CustomCursor;