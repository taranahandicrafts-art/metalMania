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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0752!2d73.8567!3d18.5196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEwLjYiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Furniture Store showroom location"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
