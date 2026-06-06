import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from '../types';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface GiftCardProps {
  gift: Gift;
  onToggle: () => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onToggle }) => {
  return (
    <motion.article 
      layout
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-[#b8e8f5]/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,119,182,0.04)] transition-all duration-300 hover:border-ocean/20 hover:shadow-[0_20px_50px_rgb(0,119,182,0.1)]"
    >
      {/* Subtle Background Glow */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-seafoam/20 blur-2xl transition-colors group-hover:bg-seafoam/40" />
      
      <div className="relative z-10 mb-5 flex items-start gap-4">
        <div className="flex-shrink-0">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sand to-[#fff8e8] shadow-soft transition-transform duration-500"
          >
            <Icon name={gift.icon} className="h-8 w-8 fill-none stroke-ocean stroke-2" />
          </motion.div>
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="truncate rounded-lg bg-seafoam/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-ocean/60">
              {gift.category}
            </span>
            
            <AnimatePresence>
              {gift.reservedCount && gift.reservedCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-coral/10 px-2 py-0.5"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
                  <span className="text-[10px] font-black text-coral">
                    {gift.reservedCount} {gift.reservedCount === 1 ? 'PLANNING' : 'PLANNING'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <h3 className="line-clamp-2 text-[1.05rem] font-extrabold leading-[1.25] text-deep transition-colors duration-300 group-hover:text-ocean">
            {gift.name}
          </h3>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex items-center gap-2 pt-4">
        {gift.url && (
          <a
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="transparent"
              className="w-full !py-2.5 !bg-sun/10 !text-deep hover:!bg-sun/30 border-2 border-sun/20 text-[11px] font-black uppercase tracking-wider transition-all"
            >
              Shop Link
            </Button>
          </a>
        )}
        <Button 
          variant={gift.reserved ? 'mint' : 'coral'} 
          onClick={onToggle}
          className={`py-2.5 whitespace-nowrap text-[11px] font-black uppercase tracking-wider transition-all ${gift.url ? 'flex-[1.2]' : 'w-full'}`}
        >
          {gift.reserved ? 'Reserved' : 'Reserve'}
        </Button>
      </div>
    </motion.article>
  );
};
