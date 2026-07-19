import Image from 'next/image';
import { Reveal, LuxButton } from './shared';

/**
 * Luxury Promotion Banner #2 — full-bleed photographic editorial.
 * A deliberately different language from Banner #1: cinematic, magazine-style.
 */
export function PromoBannerTwo() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-lux-ink">
      {/* Full-bleed image */}
      <Image
        src="https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=2000"
        alt="Evening bedroom suite bathed in warm light"
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Cinematic gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-lux-ink via-lux-ink/40 to-lux-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-lux-ink/70 via-transparent to-transparent" />

      {/* Vertical index label */}
      <span className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 text-xs uppercase tracking-[0.4em] text-lux-soft/50 lg:block">
        The bedroom edit — Vol. 04
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-lux-parchment">
              <span className="h-px w-10 bg-lux-parchment/60" />
              An editorial edit
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.02em] text-lux-soft sm:text-6xl lg:text-7xl">
              Where the day
              <br />
              <span className="italic">is finally undone</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-lux-sand/85 sm:text-lg">
              Layered linens, low oak frames and light that knows when to soften.
              Our bedroom collection is designed for the hours that belong only to you.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <LuxButton href="/products?category=bedroom" variant="gold">
                Discover the bedroom
              </LuxButton>
              <LuxButton href="/products" variant="ghost-light">
                View the full edit
              </LuxButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
