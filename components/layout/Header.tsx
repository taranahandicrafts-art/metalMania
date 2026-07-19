'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';
import { CartBadge } from '@/components/cart/CartBadge';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Collection' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Routes that open with a dark, full-bleed hero behind the fixed header —
// the header sits over them with light text until the user scrolls.
const DARK_HERO_ROUTES = new Set(['/', '/about', '/contact']);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Light-text mode while sitting over a page's dark hero, before scrolling.
  const overHero = DARK_HERO_ROUTES.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const textLight = overHero || mobileOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-lux-sand/70 bg-lux-soft/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      {/* Legibility scrim while sitting over the hero */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-lux-ink/50 to-transparent transition-opacity duration-500',
          overHero && !mobileOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20',
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'group relative z-50 font-display text-xl tracking-tight transition-colors duration-300 sm:text-2xl',
            textLight ? 'text-lux-soft' : 'text-lux-ink',
          )}
        >
          {SITE_NAME}
          <span className="text-lux-gold">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                  textLight
                    ? 'text-lux-soft/80 hover:text-lux-soft'
                    : 'text-lux-graphite hover:text-lux-ink',
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-lux-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className={cn('transition-colors duration-300', textLight ? 'text-lux-soft' : 'text-lux-ink')}>
            <CartBadge />
          </span>

          <Link
            href="/products"
            className={cn(
              'hidden h-10 items-center rounded-full border px-6 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-all duration-300 lg:inline-flex',
              textLight
                ? 'border-lux-soft/40 text-lux-soft hover:border-lux-gold hover:bg-lux-gold hover:text-lux-ink'
                : 'border-lux-ink/25 text-lux-ink hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft',
            )}
          >
            Explore
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              'relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden',
              textLight ? 'text-lux-soft' : 'text-lux-ink',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={cn('h-px w-6 bg-current transition-all duration-300', mobileOpen && 'translate-y-[6px] rotate-45')} />
            <span className={cn('h-px w-6 bg-current transition-all duration-300', mobileOpen && 'opacity-0')} />
            <span className={cn('h-px w-6 bg-current transition-all duration-300', mobileOpen && '-translate-y-[6px] -rotate-45')} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-lux-ink text-lux-soft md:hidden"
          >
            <div className="lux-grain" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(60% 40% at 50% 0%, rgba(184,149,106,0.18), transparent 70%)' }}
            />
            <nav className="relative flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="font-mono text-xs text-lux-gold">0{i + 1}</span>
                    <span
                      className={cn(
                        'font-display text-4xl transition-colors sm:text-5xl',
                        isActive(pathname, link.href) ? 'text-lux-gold' : 'text-lux-soft group-hover:text-lux-parchment',
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="relative border-t border-lux-graphite/50 px-8 py-8"
            >
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-lux-gold text-[0.78rem] font-medium uppercase tracking-[0.14em] text-lux-ink transition-colors hover:bg-lux-soft"
              >
                Explore the collection
              </Link>
              <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-lux-parchment/70">
                Handcrafted for lasting beauty
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
