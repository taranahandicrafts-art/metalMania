import React from 'react';
import { CONTACT } from '../data/showcase';
import { ContactLink } from '../types';
import { PhoneIcon, MailIcon, WhatsappIcon, FacebookIcon, InstagramIcon } from './icons';

const TopContactBar: React.FC = () => {
  const socials: ContactLink[] = [
    { id: 'wa', label: 'WhatsApp', href: CONTACT.whatsappHref, icon: <WhatsappIcon className="h-4 w-4" /> },
    { id: 'fb', label: 'Facebook', href: CONTACT.facebookHref, icon: <FacebookIcon className="h-4 w-4" /> },
    { id: 'ig', label: 'Instagram', href: CONTACT.instagramHref, icon: <InstagramIcon className="h-4 w-4" /> },
    { id: 'mail', label: 'Email', href: CONTACT.emailHref, icon: <MailIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="border-b border-black/10 bg-[#efe7d8] text-neutral-900">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-5 py-2 text-[13px]">
        {/* Left: phone + email */}
        <div className="flex items-center gap-4">
          <a href={CONTACT.phoneHref} className="flex items-center gap-1.5 font-medium transition hover:text-black/60">
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{CONTACT.phoneDisplay}</span>
          </a>
          <a href={CONTACT.emailHref} className="hidden items-center gap-1.5 font-medium transition hover:text-black/60 md:flex">
            <MailIcon className="h-4 w-4" />
            <span>{CONTACT.emailDisplay}</span>
          </a>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-7 w-7 place-items-center rounded-full text-neutral-900 transition hover:bg-neutral-900 hover:text-[#efe7d8]"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopContactBar;
