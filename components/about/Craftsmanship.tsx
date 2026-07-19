const STEPS = [
  {
    step: '01',
    title: 'Wood selection',
    description:
      'Handpicked from certified forests — we choose only the finest seasoned hardwoods, inspecting each plank for grain quality, density, and natural character.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Design',
    description:
      'Our design team translates inspiration into precision blueprints — balancing form, function, and the natural properties of the wood.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Manufacturing',
    description:
      'Skilled artisans shape each component with precision tools and time-tested joinery methods — mortise and tenon, dovetail, and finger joints.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Finishing',
    description:
      'Multiple coats of hand-applied, non-toxic finishes protect and enhance the natural beauty of the wood — bringing out its depth and warmth.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    step: '05',
    title: 'Final product',
    description:
      'Rigorous quality inspection ensures every detail meets our standards before it is carefully packaged and delivered to your home.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
];

export function Craftsmanship() {
  return (
    <section className="bg-[#F5F3EF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            The Art of Making
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
            From raw material to your home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#7A7570]">
            Every piece goes through five meticulous stages — each one guided by
            decades of expertise and an uncompromising eye for detail.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full bg-[#D4C8B8] lg:block" />
              )}

              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-[#B8956A] bg-white text-[#B8956A] transition-all duration-300 hover:bg-[#B8956A] hover:text-white">
                {step.icon}
              </div>

              <span className="text-xs font-semibold tracking-wider text-[#B8956A]">
                Step {step.step}
              </span>
              <h3 className="mt-2 text-base font-semibold text-[#1A1714]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7570]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
