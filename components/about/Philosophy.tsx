const VALUES = [
  {
    title: 'Craftsmanship',
    description:
      'Every piece is built by hand using time-honored joinery techniques. Our artisans bring decades of experience to each joint, curve, and finish — ensuring furniture that lasts generations.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'Sustainability',
    description:
      'We source wood exclusively from FSC-certified forests and use water-based, non-toxic finishes. Our manufacturing process minimizes waste, and we plant a tree for every order placed.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12z" />
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
    ),
  },
  {
    title: 'Modern living',
    description:
      'Our designs bridge the gap between contemporary aesthetics and everyday functionality. Clean lines, thoughtful proportions, and intuitive layouts that elevate your living spaces.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Comfort',
    description:
      'Beautiful furniture should feel as good as it looks. We obsess over ergonomics, cushion density, and seat depth — so every moment spent with our furniture is one of pure comfort.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Quality',
    description:
      'We stand behind every piece with a 10-year structural warranty. From kiln-dried hardwood frames to precision-engineered hardware, quality is not just a promise — it is our foundation.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function Philosophy() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            Our Philosophy
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
            Built on values that endure
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#7A7570]">
            Five principles guide every decision we make — from the forests we
            source from to the hands that shape each piece.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="group border border-[#E8E2D9] bg-white p-8 transition-all duration-300 hover:border-[#B8956A] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-[#F5F3EF] text-[#B8956A] transition-colors duration-300 group-hover:bg-[#B8956A] group-hover:text-white">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1714]">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#7A7570]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
