import Image from "next/image";

export function Showroom() {
  return (
    <section className="bg-[#F5F3EF] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
              Our Showroom
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
              Experience our furniture in person
            </h2>
            <p className="mt-6 leading-relaxed text-[#7A7570]">
              Visit our 5,000 sq. ft. showroom to experience the quality,
              texture, and craftsmanship of our furniture firsthand. Our design
              consultants are available to help you find the perfect pieces for
              your home.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#B8956A]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1A1714]">Address</p>
                  <p className="text-sm text-[#7A7570]">
                    3 Mohan nagar behind Balaji paradise Sikar road haramara{" "}
                    <br />
                    Jaipur, Rajasthan 302013, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#B8956A]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1A1714]">Parking</p>
                  <p className="text-sm text-[#7A7570]">
                    Free parking available for all visitors. Covered parking for
                    up to 50 vehicles directly in front of the showroom.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#B8956A]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#1A1714]">Opening Hours</p>
                  <div className="mt-1 space-y-1 text-sm text-[#7A7570]">
                    <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                    <p>Sunday: 11:00 AM - 6:00 PM</p>
                    <p className="text-[#9A9590]">
                      Closed on national holidays
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-8">
            <div className="relative aspect-[4/3] w-full bg-[#E8E2D9]/30">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"
                alt="Shubharambh Products showroom interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-[#1A1714]">
                Our curated showroom experience
              </p>
              <p className="mt-1 text-xs text-[#9A9590]">
                Walk through styled room settings and discover pieces that
                inspire
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
