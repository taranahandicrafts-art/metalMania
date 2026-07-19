const HOURS = [
  { day: 'Monday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Tuesday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Wednesday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Thursday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Friday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Saturday', time: '10:00 AM - 7:00 PM', active: true },
  { day: 'Sunday', time: '11:00 AM - 6:00 PM', active: true },
];

export function BusinessHours() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
              Business Hours
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
              When we&apos;re open
            </h2>
          </div>

          <div className="relative mt-10">
            <div className="absolute left-4 top-0 h-full w-px bg-[#B8956A]" />

            <div className="space-y-0">
              {HOURS.map((entry, i) => (
                <div key={entry.day} className="relative flex items-center py-4">
                  <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-[#B8956A] bg-white text-xs font-semibold text-[#B8956A]">
                    {String(i + 1)}
                  </div>
                  <div className="ml-6 flex flex-1 items-center justify-between">
                    <span className="font-medium text-[#1A1714]">
                      {entry.day}
                    </span>
                    <span className="text-sm text-[#7A7570]">{entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
