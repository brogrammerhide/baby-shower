import React from 'react';
import { Gift } from '../types';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface GiftCardProps {
  gift: Gift;
  onToggle: () => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onToggle }) => {
  return (
    <article className="group flex flex-col h-full rounded-[24px] border-2 border-[#b8e8f5] bg-white p-5 shadow-[0_8px_30px_rgb(0,119,182,0.06)] transition-all hover:shadow-[0_12px_40px_rgb(0,119,182,0.12)] hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sand to-[#fff8e8] shadow-soft transition-transform group-hover:scale-110">
            <Icon name={gift.icon} className="h-8 w-8 fill-none stroke-ocean stroke-2" />
          </span>
          {gift.reservedCount && gift.reservedCount > 0 ? (
            <div className="absolute -top-2 -right-2 bg-coral text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pop-in">
              {gift.reservedCount} {gift.reservedCount === 1 ? 'RESERVED' : 'RESERVED'}
            </div>
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-ocean/50 bg-seafoam/50 px-2 py-0.5 rounded-md mb-1">
            {gift.category}
          </span>
          <h3 className="text-[1.1rem] font-extrabold leading-tight text-deep transition-colors group-hover:text-ocean">
            {gift.name}
          </h3>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2">
        {gift.url && (
          <a
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="transparent"
              className="w-full !py-2.5 !bg-sun/15 !text-deep hover:!bg-sun/40 border-2 border-sun/30 text-[10px] font-black uppercase tracking-wider"
            >
              Shop Link
            </Button>
          </a>
        )}
        <Button 
          variant={gift.reserved ? 'mint' : 'coral'} 
          onClick={onToggle}
          className={`py-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-wider ${gift.url ? 'flex-[1.2]' : 'w-full'}`}
        >
          {gift.reserved ? 'Reserved' : 'Reserve'}
        </Button>
      </div>
    </article>
  );
};
