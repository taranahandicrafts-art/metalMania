import Link from 'next/link';
import {
  SITE_NAME,
  WHATSAPP_NUMBER,
  PHONE_NUMBER,
  EMAIL_ADDRESS,
  FACEBOOK_URL,
  INSTAGRAM_URL,
} from '@/lib/constants';

const FOOTER_LINKS: { title: string; links: { href: string; label: string; prefetch?: boolean }[] }[] = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/products?is_new_arrival=true', label: 'New Arrivals' },
      { href: '/products?is_best_seller=true', label: 'Best Sellers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us', prefetch: false },
      { href: '/contact', label: 'Contact', prefetch: false },
      { href: '/privacy', label: 'Privacy Policy', prefetch: false },
      { href: '/terms', label: 'Terms & Conditions', prefetch: false },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/shipping', label: 'Shipping Info', prefetch: false },
      { href: '/returns', label: 'Returns & Exchanges', prefetch: false },
      { href: '/faq', label: 'FAQ', prefetch: false },
    ],
  },
];

// Only render links that are actually configured.
const SOCIAL_LINKS = [
  WHATSAPP_NUMBER && {
    label: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}`,
    Icon: WhatsAppIcon,
    external: true,
  },
  EMAIL_ADDRESS && {
    label: 'Email',
    href: `mailto:${EMAIL_ADDRESS}`,
    Icon: MailIcon,
    external: false,
  },
  FACEBOOK_URL && {
    label: 'Facebook',
    href: FACEBOOK_URL,
    Icon: FacebookIcon,
    external: true,
  },
  INSTAGRAM_URL && {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    Icon: InstagramIcon,
    external: true,
  },
].filter(Boolean) as { label: string; href: string; Icon: React.FC<{ className?: string }>; external: boolean }[];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-black border-t border-[#e5e5e6] bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium handcrafted furniture designed for lasting beauty and everyday comfort.
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {WHATSAPP_NUMBER && <p>WhatsApp: {WHATSAPP_NUMBER}</p>}
              {PHONE_NUMBER && <p>Phone: {PHONE_NUMBER}</p>}
            </div>

            {/* Social icons */}
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="border-[#e5e5e6] flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title} className="space-y-3">
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={link.prefetch ?? undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#e5e5e6] pt-6 text-center text-sm text-muted-foreground">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Inline SVG icons (no external icon lib) ---------------- */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}
