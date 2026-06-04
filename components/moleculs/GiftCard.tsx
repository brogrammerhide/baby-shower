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
    <article className="flex flex-col min-h-[280px] rounded-[24px] border-2 border-[#b8e8f5] bg-white p-5 shadow-[0_8px_30px_rgb(0,119,182,0.08)] transition-all hover:shadow-[0_8px_30px_rgb(0,119,182,0.15)] hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sand to-[#fff8e8] shadow-soft">
            <Icon name={gift.icon} className="h-7 w-7 fill-none stroke-ocean stroke-2" />
          </span>
          <div>
            <span className="text-[.65rem] font-black uppercase tracking-widest text-ocean/60 bg-seafoam px-2 py-0.5 rounded-md">
              {gift.category}
            </span>
            <h3 className="text-[1.05rem] font-extrabold leading-tight text-deep mt-0.5">{gift.name}</h3>
          </div>
        </div>
        <span className="text-[1.25rem] font-black text-coral">{gift.price}</span>
      </div>

      <div className="flex gap-4 flex-1">
        {gift.imageUrl && (
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-ocean/5 shadow-inner bg-seafoam/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={gift.imageUrl} 
              alt={gift.name} 
              className="h-full w-full object-cover" 
            />
          </div>
        )}
        <p className="text-sm font-bold leading-relaxed text-[#4a6c7d] line-clamp-4">
          {gift.note}
        </p>
      </div>
      
      <div className="mt-6 flex items-center gap-2">
        {gift.url && (
          <a 
            href={gift.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex"
          >
            <Button 
              variant="transparent"
              className="w-full !py-2.5 !bg-sun/20 !text-deep hover:!bg-sun border-2 border-sun/30"
            >
              Amazon
            </Button>
          </a>
        )}
        <Button 
          variant={gift.reserved ? 'mint' : 'coral'} 
          onClick={onToggle}
          className={`py-2.5 whitespace-nowrap ${gift.url ? 'flex-1' : 'w-full'}`}
        >
          {gift.reserved ? 'Reserved' : 'Reserve'}
        </Button>
      </div>
    </article>
  );
};
