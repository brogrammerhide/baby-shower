import React from 'react';
import { motion } from 'framer-motion';

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  active, 
  onClick 
}) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative min-h-[39px] rounded-full border-2 px-[13px] font-black cursor-pointer transition-colors duration-300 ${active ? 'border-ocean text-ocean' : 'border-[#b8e8f5] bg-white text-deep hover:bg-seafoam/20'}`}
    >
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 z-0 rounded-full bg-seafoam"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </span>
    </motion.button>
  );
};
