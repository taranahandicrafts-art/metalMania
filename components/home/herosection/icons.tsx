import React from 'react';

type IconProps = { className?: string };
const base = 'none';

export const PercentIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={1.8}>
    <circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const CustomersIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

export const DeliveryIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={1.8}>
    <rect x="1" y="6" width="13" height="10" rx="1" /><path d="M14 9h4l3 3v4h-7z" />
    <circle cx="6" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" />
  </svg>
);

export const WarrantyIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

export const ManufacturingIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={1.8}>
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.3 2.3-2-2z" />
  </svg>
);

export const ChevronLeft: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2.2}><polyline points="15 18 9 12 15 6" /></svg>
);

export const ChevronRight: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2.2}><polyline points="9 18 15 12 9 6" /></svg>
);

// Contact icons
export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const WhatsappIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill={base}
       stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
