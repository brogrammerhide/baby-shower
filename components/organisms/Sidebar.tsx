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
      <div className="relative bg-gradient-to-br from-ocean to-[#48cae4] px-[18px] pb-[42px] pt-[34px] text-center shadow-[inset_0_4px_20px_rgba(0,119,182,.3)] after:absolute after:bottom-[-1px] after:left-0 after:h-[30px] after:w-full after:bg-white/90 after:[clip-path:ellipse(55%_100%_at_50%_100%)] sm:px-7">
        <span className="mb-2.5 flex items-center justify-center gap-2.5 text-[#eefcff] drop-shadow-[0_2px_5px_rgba(0,0,0,.16)]" aria-hidden="true">
          <Icon name="wave" className="h-[34px] w-[34px] fill-none stroke-current stroke-2" />
          <Icon name="shell" className="h-[34px] w-[34px] fill-none stroke-current stroke-2" />
          <Icon name="sun" className="h-[34px] w-[34px] fill-none stroke-current stroke-2" />
          <Icon name="fish" className="h-[34px] w-[34px] fill-none stroke-current stroke-2" />
        </span>
        <h1 className="mb-4.5 font-pacifico text-[clamp(2rem,7vw,3.05rem)] leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.15)]">Baby Shower!👶</h1>
        <p className="text-base font-extrabold leading-normal text-[#eefcff]">Celebrating our little summer boy, arriving in July.</p>
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
        
        <motion.div variants={itemVariants} className="mt-2.5 overflow-hidden rounded-[20px] border-2 border-[#b8e8f5] shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/i_want_you_final.png" 
            alt="Baby face poster" 
            className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
