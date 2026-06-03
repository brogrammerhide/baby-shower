'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { Floater } from '../types';
import { BackgroundFloater } from '../atoms/BackgroundFloater';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [floaters, setFloaters] = useState<Floater[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const floatingIconsList = ['wave', 'shell', 'fish', 'star', 'flower', 'sun', 'umbrella'];
    const newFloaters = Array.from({ length: 18 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      duration: `${8 + Math.random() * 14}s`,
      delay: `${Math.random() * 12}s`,
      size: `${1.2 + Math.random() * 1.4}rem`,
      icon: floatingIconsList[Math.floor(Math.random() * floatingIconsList.length)]
    }));
    setFloaters(newFloaters);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(255,209,102,.55),transparent_260px),radial-gradient(circle_at_86%_18%,rgba(110,214,181,.35),transparent_300px),linear-gradient(180deg,#b8f0ff_0%,#e0f7fa_42%,#fde8c8_100%)] px-3 py-[18px] pb-[108px] font-nunito text-deep sm:px-4 sm:py-[30px] sm:pb-28">
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="afterInteractive" />

      {/* Background Floaters */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {floaters.map((floater, i) => (
          <BackgroundFloater key={i} {...floater} />
        ))}
      </div>

      {/* Animated Waves */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[86px] overflow-hidden" aria-hidden="true">
        <svg className="absolute bottom-0 left-0 h-[86px] w-[200%] animate-wave" viewBox="0 0 1600 86" preserveAspectRatio="none">
          <path d="M0,43 C100,82 200,4 400,43 C600,82 700,4 800,43 C900,82 1000,4 1200,43 C1400,82 1500,4 1600,43 L1600,86 L0,86 Z" fill="#0077b6" opacity=".42"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 h-[86px] w-[200%] animate-wave-slow" viewBox="0 0 1600 86" preserveAspectRatio="none">
          <path d="M0,55 C150,12 250,75 400,43 C550,12 650,75 800,55 C950,12 1050,75 1200,43 C1350,12 1450,75 1600,55 L1600,86 L0,86 Z" fill="#90e0ef" opacity=".58"></path>
        </svg>
      </div>

      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
