import React from 'react';
import { motion } from 'framer-motion';
import { Details } from '../types';
import { InfoRow } from '../moleculs/InfoRow';
import { Icon } from '../atoms/Icon';

interface SidebarProps {
  details: Details;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const Sidebar: React.FC<SidebarProps> = ({ details }) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(details.place);
    alert('Address copied to clipboard!');
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-white/90 shadow-card backdrop-blur-lg" aria-label="Baby shower details">
      <div className="relative overflow-hidden bg-gradient-to-br from-ocean to-[#48cae4] pb-6 after:absolute after:bottom-[-1px] after:left-0 after:h-[25px] after:w-full after:bg-white after:[clip-path:ellipse(55%_100%_at_50%_100%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/i_want_you_final.png" 
          alt="Baby Shower Poster" 
          className="w-full h-auto object-cover"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-3.5 px-7 pb-[30px] pt-4"
      >
        <motion.div variants={itemVariants}><InfoRow icon="calendar" label="Date" value={details.date} /></motion.div>
        <motion.div variants={itemVariants}><InfoRow icon="umbrella" label="Theme" value={details.theme} /></motion.div>
        <motion.div variants={itemVariants}><InfoRow icon="pin" label="Place" value={details.place} onClick={copyAddress} title="Click to copy address" /></motion.div>
      </motion.div>
    </section>
  );
};
