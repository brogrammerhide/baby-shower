import React from 'react';
import { motion } from 'framer-motion';
import { Details } from '../types';
import { InfoRow } from '../moleculs/InfoRow';
import { Icon } from '../atoms/Icon';

import { toast } from 'react-toastify';

interface SidebarProps {
  details: Details;
  onViewSchedule?: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ details, onViewSchedule }) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(details.place);
    toast.success('Address copied to clipboard!');
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
        
        <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-ocean/10 shadow-soft">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.2487615031764!2d-79.48081471505542!3d43.72615888149478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3182b9000001%3A0xb2150d3e77fbdf01!2s2737%20Keele%20St%2C%20North%20York%2C%20ON%20M3M%202E9!5e0!3m2!1sen!2sca!4v1780760402841!5m2!1sen!2sca"
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InfoRow 
            icon="parking" 
            label="Parking" 
            value="Free at Metro/Shoppers Plaza" 
            title="Free parking at the plaza across the street. Paid parking is available around the condo."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InfoRow 
            icon="clock" 
            label="Schedule" 
            value="Celebration Itinerary" 
            onClick={onViewSchedule}
            hideCopyIcon={true}
            title="Click to see what we have planned!"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
