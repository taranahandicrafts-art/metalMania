import Link from 'next/link';
import { Reveal, LuxButton } from './shared';
import { WHATSAPP_NUMBER, PHONE_NUMBER, WHATSAPP_MESSAGE_TEMPLATE } from '@/lib/constants';

/**
 * Get in Touch — the closing invitation. Warm, generous, and full of ways
 * to start a conversation (WhatsApp, call, visit, or explore).
 */
export function CTA() {
  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_TEMPLATE)}`
    : null;

  const channels: {
    label: string;
    value: string;
    href: string;
    external: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      label: PHONE_NUMBER ? 'Call the studio' : 'Talk to us',
      value: PHONE_NUMBER || 'Speak with a consultant',
      href: PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : '/contact',
      external: false,
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      ),
    },
    {
      label: 'Visit the studio',
      value: 'By appointment',
      href: '/contact',
      external: false,
      icon: (
        <>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
    {
      label: 'Delivery & care',
      value: 'Our promises',
      href: '/shipping',
      external: false,
      icon: (
        <>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
        </>
      ),
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-lux-ink py-28 text-lux-soft sm:py-36">
      <div className="lux-grain" />
      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(50% 60% at 50% 0%, rgba(184,149,106,0.22), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-lux-parchment">
            <span className="h-px w-8 bg-lux-parchment/50" />
            Let&rsquo;s begin
            <span className="h-px w-8 bg-lux-parchment/50" />
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-lux-soft sm:text-6xl">
            Your space is waiting
            <br />
            <span className="italic text-lux-gold">for its finest hour</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-lux-sand/80 sm:text-lg">
            Explore the full collection, or speak with a design consultant who will
            help you shape a room you will love for decades.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LuxButton href="/products" variant="gold">
              Explore the collection
            </LuxButton>
            {whatsappHref ? (
              <LuxButton href={whatsappHref} variant="ghost-light" external ariaLabel="Chat on WhatsApp">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.15L2 22l4.98-1.3A9.9 9.9 0 1 0 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11a11.6 11.6 0 0 1-1.65-.61 9.1 9.1 0 0 1-3.49-3.08c-.26-.35-.9-1.2-.9-2.29s.57-1.62.78-1.84a.8.8 0 0 1 .58-.27h.42c.13 0 .32-.05.5.38.18.44.62 1.52.68 1.63.05.11.09.24.02.39-.29.6-.6.77-.4 1.12.37.64.98 1.34 1.62 1.73.28.17.44.15.6-.04.16-.18.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.27.13.45.2.51.31.07.11.07.65-.17 1.33Z" />
                </svg>
                Message us
              </LuxButton>
            ) : (
              <LuxButton href="/contact" variant="ghost-light">
                Book a consultation
              </LuxButton>
            )}
          </div>
        </Reveal>

        {channels.length > 0 && (
          <Reveal delay={0.32}>
            <div className="mx-auto mt-16 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-lux-graphite/60 bg-lux-graphite/60 sm:grid-cols-3">
              {channels.map((c) => {
                const inner = (
                  <span className="flex h-full flex-col items-center gap-3 bg-lux-ink px-6 py-7 text-center transition-colors duration-300 hover:bg-lux-charcoal">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-lux-graphite text-lux-gold">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {c.icon}
                      </svg>
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-lux-parchment">{c.label}</span>
                    <span className="text-sm text-lux-sand/80">{c.value}</span>
                  </span>
                );
                return c.external ? (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="block">
                    {inner}
                  </a>
                ) : (
                  <Link key={c.label} href={c.href} className="block">
                    {inner}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
