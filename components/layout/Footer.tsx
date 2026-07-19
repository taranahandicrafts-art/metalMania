import Link from 'next/link';
import { SITE_NAME, WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/constants';

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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
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

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
