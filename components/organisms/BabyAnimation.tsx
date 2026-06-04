import React from 'react';

const CRY_SRC = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/lottie.json';
const IDLE_SRC = 'https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json';

interface BabyAnimationProps {
  mode: 'idle' | 'happy' | 'sad';
}

export const BabyAnimation: React.FC<BabyAnimationProps> = ({ mode }) => {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center px-[18px] pb-2 pt-4 transition-all duration-300">
      {mode !== 'idle' && (
        <div className={`relative mb-1.5 animate-pop-in rounded-2xl px-4 py-2 text-sm font-extrabold shadow-[0_3px_10px_rgba(0,0,0,.1)] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-[inherit] ${mode === 'happy' ? 'bg-[#d4f7e5] text-[#1a6640]' : 'bg-[#ffe0e0] text-[#b91c1c]'}`}>
          {mode === 'happy' ? 'Yay, see you there!' : 'We will see each other soon!!'}
        </div>
      )}
      {/* @ts-expect-error lottie-player is a custom element */}
      <lottie-player
        class="h-40 w-40 transition-opacity duration-300"
        src={mode === 'sad' ? CRY_SRC : IDLE_SRC}
        background="transparent"
        speed="1"
        loop
        autoplay
      />
      <div className={`min-h-7 text-center font-pacifico text-base ${mode === 'happy' ? 'text-[#2a9d5c]' : mode === 'sad' ? 'text-[#e63946]' : 'text-ocean'}`}>
        {mode === 'happy' ? 'Yay! Baby is SO excited to meet you!' : mode === 'sad' ? 'Aww... baby will miss you!' : 'Will you come celebrate?'}
      </div>
    </div>
  );
};
