import React from 'react';
import { Icon } from './Icon';

interface BackgroundFloaterProps {
  left: string;
  duration: string;
  delay: string;
  size: string;
  icon: string;
}

export const BackgroundFloater: React.FC<BackgroundFloaterProps> = ({ 
  left, 
  duration, 
  delay, 
  size, 
  icon 
}) => {
  return (
    <div
      className="absolute animate-float-up text-ocean/20 drop-shadow-[0_3px_6px_rgba(0,119,182,.12)]"
      style={{
        left,
        animationDuration: duration,
        animationDelay: delay,
        fontSize: size
      }}
    >
      <Icon name={icon} className="h-8 w-8 fill-none stroke-current stroke-2" aria-hidden="true" />
    </div>
  );
};
