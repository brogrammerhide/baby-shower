import React from 'react';

const CRY_SRC = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/lottie.json';
const HAPPY_SRC = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json';
const IDLE_SRC = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f476/lottie.json';

interface BabyAnimationProps {
  mode: 'idle' | 'happy' | 'sad';
}

function lottieSrc(mode: BabyAnimationProps['mode']) {
  if (mode === 'sad') return CRY_SRC;
  if (mode === 'happy') return HAPPY_SRC;
  return IDLE_SRC;
}

export const BabyAnimation: React.FC<BabyAnimationProps> = ({ mode }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-ocean/10 shadow-sm animate-pop-in">
      {/* @ts-expect-error lottie-player is a custom element */}
      <lottie-player
        key={mode}
        class="h-10 w-10 transition-opacity duration-300"
        src={lottieSrc(mode)}
        background="transparent"
        speed="1"
        loop
        autoplay
      />
      <span className={`text-[11px] font-black uppercase tracking-wider ${mode === 'happy' ? 'text-[#2a9d5c]' : mode === 'sad' ? 'text-[#e63946]' : 'text-ocean'}`}>
        {mode === 'happy' ? 'Yay!' : mode === 'sad' ? 'Missing you!' : 'Waiting...'}
      </span>
    </div>
  );
};
