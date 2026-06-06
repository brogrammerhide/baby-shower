import React from 'react';
import { motion } from 'framer-motion';

interface PageTemplateProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  maxWidth?: string;
  gridCols?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a smooth 'organic' feel
    },
  },
};

export const PageTemplate: React.FC<PageTemplateProps> = ({
  sidebar,
  content,
  maxWidth = 'max-w-[1040px]',
  gridCols = 'lg:grid-cols-[minmax(310px,.88fr)_minmax(0,1.12fr)]'
}) => {
  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`mx-auto grid w-full items-start gap-[22px] ${maxWidth} ${gridCols}`}
    >
      <motion.div variants={itemVariants}>
        {sidebar}
      </motion.div>
      <motion.section 
        variants={itemVariants}
        className="overflow-hidden rounded-[28px] bg-white/90 p-[18px] shadow-card backdrop-blur-lg sm:p-6"
      >
        {content}
      </motion.section>
    </motion.main>
  );
};
