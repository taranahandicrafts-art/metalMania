export function MapSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            Visit Us
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
            Find our showroom
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden border border-[#E8E2D9]">
          <div className="relative aspect-[16/9] w-full bg-[#F5F3EF]">
            <iframe
              src="https://maps.google.com/maps?q=27.0079624,75.7704591&output=embed&z=18"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shubharambh Products showroom location"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
