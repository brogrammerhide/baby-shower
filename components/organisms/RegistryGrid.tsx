import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '../types';
import { Input } from '../atoms/Input';
import { FilterButton } from '../moleculs/FilterButton';
import { GiftCard } from '../moleculs/GiftCard';

interface RegistryGridProps {
  gifts: Gift[];
  onToggleReservation: (index: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const RegistryGrid: React.FC<RegistryGridProps> = ({ gifts, onToggleReservation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGifts = gifts
    .map((gift, index) => ({ gift, index }))
    .filter(({ gift }) => activeFilter === 'all' || gift.category === activeFilter)
    .filter(({ gift }) =>
      `${gift.name} ${gift.category} ${gift.note || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="mb-[18px] grid items-start gap-[18px] sm:flex sm:items-end sm:justify-between">
        <h2 className="font-pacifico text-[clamp(1.65rem,5vw,2.3rem)] leading-tight text-ocean">Little Wave Registry</h2>
        <p className="max-w-[420px] font-bold leading-normal text-[#315566]">Pick a gift, reserve it, and help us get ready for our beachy July baby.</p>
      </div>

      <div className="mb-[18px] grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
          <strong className="block text-[1.45rem] font-black leading-none text-coral">{gifts.length}</strong>
          <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Gift ideas</span>
        </motion.div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
          <strong className="block text-[1.45rem] font-black leading-none text-coral">{gifts.filter(g => g.reserved).length}</strong>
          <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Reserved</span>
        </motion.div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
          <strong className="block text-[1.45rem] font-black leading-none text-coral">July</strong>
          <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Baby due</span>
        </motion.div>
      </div>

      <div className="mb-4 grid items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input 
          type="search" 
          placeholder="Search gifts or notes" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap justify-start gap-[7px] sm:justify-end">
          {['all', 'nursery', 'beach', 'feeding', 'care'].map((filter) => (
            <FilterButton 
              key={filter} 
              label={filter} 
              active={activeFilter === filter} 
              onClick={() => setActiveFilter(filter)} 
            />
          ))}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredGifts.length > 0 ? (
            filteredGifts.map(({ gift, index }) => (
              <motion.div
                layout
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GiftCard 
                  gift={gift} 
                  onToggle={() => onToggleReservation(index)} 
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[18px] border-2 border-dashed border-[#b8e8f5] bg-white/70 p-6 text-center font-extrabold text-[#497184] sm:col-span-2"
            >
              No gifts match that search yet.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
