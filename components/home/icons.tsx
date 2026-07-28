import React from 'react';

type IconProps = { className?: string };
const base = 'none';

export const ChevronLeft: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2.2}><polyline points="15 18 9 12 15 6" /></svg>
);

export const ChevronRight: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2.2}><polyline points="9 18 15 12 9 6" /></svg>
);
