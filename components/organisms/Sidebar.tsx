import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Details } from '../types';
import { InfoRow } from '../moleculs/InfoRow';
import { Icon } from '../atoms/Icon';

interface SidebarProps {
  details: Details;
  isEditPage?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const Sidebar: React.FC<SidebarProps> = ({ details, isEditPage = false }) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(details.place);
    alert('Address copied to clipboard!');
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-white/90 shadow-card backdrop-blur-lg" aria-label="Baby shower details">
      <div className="relative bg-gradient-to-br from-ocean to-[#48cae4] px-[18px] pb-[42px] pt-[34px] text-center shadow-[inset_0_4px_20px_rgba(0,119,182,.3)] after:absolute after:bottom-[-1px] after:left-0 after:h-[30px] after:w-full after:bg-white/90 after:[clip-path:ellipse(55%_100%_at_50%_100%)] sm:px-7">
        {!isEditPage && (
          <Link href="/edit" className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[#eefcff] backdrop-blur-md transition hover:bg-white hover:text-ocean shadow-soft animate-pulse" title="Edit Registry & Details">
            <svg className="h-5 w-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
            </svg>
          </Link>
        )}
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
      </motion.div>
    </section>
  );
};
