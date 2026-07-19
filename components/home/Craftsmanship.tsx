import Image from 'next/image';
import { Reveal, RevealGroup, RevealItem, SectionHeading } from './shared';

interface Material {
  name: string;
  tag: string;
  description: string;
  image: string;
}

const MATERIALS: Material[] = [
  {
    name: 'Timber',
    tag: '01 — Wood',
    description:
      'Slow-grown European oak and American walnut, kiln-dried to stability and finished with hand-rubbed natural oils.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200',
  },
  {
    name: 'Textile',
    tag: '02 — Fabric',
    description:
      'Belgian linen, Italian bouclé and full-grain leather — chosen for how they wear, soften and age with you.',
    image: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?q=80&w=1200',
  },
  {
    name: 'Metal',
    tag: '03 — Hardware',
    description:
      'Solid brass and blackened steel, machined in-house and finished by hand for a weight that speaks of permanence.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
  },
  {
    name: 'The hand',
    tag: '04 — Finishing',
    description:
      'Every edge eased, every joint fitted, every surface sanded through the grades until it invites the touch.',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200',
  },
];

export function Craftsmanship() {
  return (
    <section className="relative overflow-hidden bg-lux-charcoal py-24 text-lux-soft sm:py-32">
      <div className="lux-grain" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Narrative — sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              tone="light"
              eyebrow="Craft & materials"
              title={
                <>
                  The making is
                  <br />
                  the meaning
                </>
              }
              description="We start with the raw material and let it lead. What follows is a hundred small decisions — most of which you will never see, and all of which you will feel."
            />

            <Reveal delay={0.2}>
              <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-lux-graphite/60 pt-10">
                {[
                  { k: '40+', v: 'Hours per piece' },
                  { k: '100%', v: 'FSC-certified timber' },
                  { k: '25yr', v: 'Structural guarantee' },
                  { k: 'Zero', v: 'Single-use plastic' },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-4xl text-lux-gold">{s.k}</dt>
                    <dd className="mt-1 text-sm text-lux-sand/70">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Material chapters */}
          <RevealGroup className="space-y-6" stagger={0.12}>
            {MATERIALS.map((m) => (
              <RevealItem key={m.name}>
                <article className="group grid grid-cols-[7rem_1fr] items-stretch gap-5 rounded-2xl border border-lux-graphite/50 bg-lux-ink/40 p-4 transition-colors duration-500 hover:border-lux-gold/50 sm:grid-cols-[10rem_1fr] sm:gap-7 sm:p-5">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 30vw, 160px"
                      className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-lux-gold">{m.tag}</p>
                    <h3 className="mt-2 font-display text-2xl text-lux-soft sm:text-3xl">{m.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-lux-sand/70">{m.description}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
