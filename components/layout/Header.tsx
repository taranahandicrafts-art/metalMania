"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { CartBadge } from "@/components/cart/CartBadge";
import AnnouncementBar from "../home/herosection/AnnouncementBar";
import TopContactBar from "../home/herosection/TopContactBar";
import { HeaderSearch } from "./HeaderSearch";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DARK_HERO_ROUTES = new Set(["/about", "/contact"]);

export function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overHero = DARK_HERO_ROUTES.has(pathname) && !scrolled;
  const textLight = overHero || mobileOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-lux-sand/70 bg-lux-soft/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <AnnouncementBar />
        <TopContactBar />

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-lux-ink/50 to-transparent transition-opacity duration-500",
            overHero && !mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "flex w-full items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className={cn(
                "relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden",
                textLight ? "text-lux-soft" : "text-lux-ink",
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className="h-px w-6 bg-current transition-all duration-300" />
              <span className="h-px w-6 bg-current transition-all duration-300" />
              <span className="h-px w-6 bg-current transition-all duration-300" />
            </button>

            <nav className="hidden items-center gap-4 xl:gap-9 lg:flex">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                      textLight
                        ? "text-lux-soft/80 hover:text-lux-soft"
                        : "text-lux-graphite hover:text-lux-ink",
                    )}
                  >
                    {link.label}

                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-lux-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href="/"
            className="group absolute left-1/2 z-50 flex -translate-x-1/2 flex-col items-center text-center transition-colors duration-300"
          >
            <span
              className={cn(
                "font-display text-lg leading-none tracking-tight sm:text-3xl",
                textLight ? "text-lux-soft" : "text-lux-ink",
              )}
            >
              {SITE_NAME}
              <span className="text-lux-gold">.</span>
            </span>

            <span
              className={cn(
                "mt-0.5 text-[0.55rem] uppercase tracking-[0.18em] sm:text-[0.65rem]",
                textLight ? "text-lux-soft/70" : "text-lux-graphite/80",
              )}
            >
              {SITE_TAGLINE}
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <HeaderSearch textLight={textLight} />

            <span
              className={cn(
                "transition-colors duration-300",
                textLight ? "text-lux-soft" : "text-lux-ink",
              )}
            >
              <CartBadge />
            </span>
          </div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-y-auto bg-lux-ink text-lux-soft lg:hidden"
              >
                <div className="lux-grain" />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(60% 40% at 50% 0%, rgba(184,149,106,0.18), transparent 70%)",
                  }}
                />

                {/* Close icon remains on the left, matching the hamburger */}
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="absolute left-4 top-5 z-20 flex h-10 w-10 items-center justify-center text-lux-soft"
                >
                  <span className="relative block h-6 w-6">
                    <span className="absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </button>

                <nav className="relative flex flex-1 flex-col justify-center gap-2 px-8 pb-8 pt-20">
                  {NAV_LINKS.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.08,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-baseline gap-4 py-2"
                      >
                        <span className="font-mono text-xs text-lux-gold">
                          0{index + 1}
                        </span>

                        <span
                          className={cn(
                            "font-display text-4xl transition-colors sm:text-5xl",
                            isActive(pathname, link.href)
                              ? "text-lux-gold"
                              : "text-lux-soft group-hover:text-lux-parchment",
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
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
