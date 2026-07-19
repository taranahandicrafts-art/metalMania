import Link from 'next/link';

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1A1714] py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1714] via-[#2C2824] to-[#1A1714]" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#B8956A]">
          Start Your Journey
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Let&apos;s build your dream space
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Whether you are furnishing a new home or redesigning a single room, our
          design team is ready to bring your vision to life.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center bg-[#B8956A] px-8 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-[#A07D52] active:scale-95"
          >
            Browse Collection
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center border border-white/30 px-8 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
