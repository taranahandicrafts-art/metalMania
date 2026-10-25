import Image from 'next/image';
import { Reveal, LuxButton } from './shared';

function normalizeGoogleDriveUrl(url: string): string {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  const idMatch = url.match(
    /drive\.google\.com\/(?:open|uc)\?[^"]*[?&]id=([a-zA-Z0-9_-]+)/,
  );
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  return url;
}

export interface PromoBannerSettings {
  eyebrow?: string;
  title?: string;
  title_accent?: string;
  description?: string;
  cta_primary_text?: string;
  cta_primary_href?: string;
  cta_secondary_text?: string;
  cta_secondary_href?: string;
  image?: string;
  discount_percent?: number;
  from_price?: string;
  footnote?: string;
}

const DEFAULTS: Required<PromoBannerSettings> = {
  eyebrow: 'The atelier event',
  title: 'The living room,',
  title_accent: 'reimagined',
  description:
    'For a limited season, our signature seating and hand-built casegoods are offered with white-glove delivery included — and up to a quarter off the collection.',
  cta_primary_text: 'Shop the event',
  cta_primary_href: '/products?is_featured=true',
  cta_secondary_text: 'Book a consultation',
  cta_secondary_href: '/about',
  image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400',
  discount_percent: 25,
  from_price: '₹38,000',
  footnote: 'Ends this season · Terms apply',
};

interface PromoBannerOneProps {
  settings?: PromoBannerSettings;
}

export function PromoBannerOne({ settings }: PromoBannerOneProps) {
  const s = { ...DEFAULTS, ...settings };

  return (
    <section className="relative overflow-hidden bg-lux-sand py-24 sm:py-28">
      {/* Soft radial warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 78% 30%, rgba(184,149,106,0.18), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Copy */}
        <div className="max-w-xl">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-lux-gold-dark">
              <span className="h-px w-8 bg-lux-gold-dark/50" />
              {s.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-lux-ink sm:text-5xl lg:text-6xl">
              {s.title}
              <br />
              <span className="italic text-lux-gold-dark">{s.title_accent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-lux-graphite sm:text-lg">
              {s.description}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LuxButton href={s.cta_primary_href} variant="gold">
                {s.cta_primary_text}
              </LuxButton>
              <LuxButton href={s.cta_secondary_href} variant="outline">
                {s.cta_secondary_text}
              </LuxButton>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-lux-stone">
              {s.footnote}
            </p>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal direction="left" delay={0.1} className="relative">
          <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-4xl bg-lux-ivory shadow-[0_40px_80px_-40px_rgba(26,23,20,0.5)]">
            <Image
              src={normalizeGoogleDriveUrl(s.image)}
              alt="Curated living room setting"
              fill
              sizes="(max-width: 1024px) 80vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Floating discount seal */}
          <div className="lux-float absolute -left-2 top-6 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-lux-ink text-center text-lux-soft shadow-xl sm:-left-6 sm:h-32 sm:w-32">
            <span className="font-display text-3xl leading-none sm:text-4xl">{s.discount_percent}%</span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-lux-parchment">off</span>
          </div>

          {/* Floating price chip */}
          <div className="absolute -bottom-4 right-4 rounded-2xl border border-lux-sand bg-lux-soft/95 px-5 py-3 shadow-lg backdrop-blur sm:right-8">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-lux-stone">From</p>
            <p className="font-display text-xl text-lux-ink">{s.from_price}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
