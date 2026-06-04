import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  return (
    <svg {...props}>
      <use href={`#icon-${name}`}></use>
    </svg>
  );
};
