import React from 'react';

interface PageTemplateProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  maxWidth?: string;
  gridCols?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  sidebar,
  content,
  maxWidth = 'max-w-[1040px]',
  gridCols = 'lg:grid-cols-[minmax(310px,.88fr)_minmax(0,1.12fr)]'
}) => {
  return (
    <main className={`mx-auto grid w-full items-start gap-[22px] ${maxWidth} ${gridCols}`}>
      {sidebar}
      <section className="overflow-hidden rounded-[28px] bg-white/90 p-[18px] shadow-card backdrop-blur-lg sm:p-6">
        {content}
      </section>
    </main>
  );
};
