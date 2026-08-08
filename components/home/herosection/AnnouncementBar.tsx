'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ANNOUNCEMENTS } from '../data/showcase';
import { Announcement } from '../types';
import { ChevronLeft, ChevronRight } from './icons';

interface AnnouncementBarProps {
  items?: Announcement[];
  autoPlayMs?: number;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  items = ANNOUNCEMENTS,
  autoPlayMs = 4000,
}) => {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length;

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), autoPlayMs);
  };

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, autoPlayMs]);

  const go = (n: number) => {
    setIndex((n + total) % total);
    restart();
  };

  return (
    <div className="relative overflow-hidden bg-neutral-900 text-[#efe7d8]">
      <div className="mx-auto flex max-w-[1360px] items-center justify-center gap-3 px-10 py-2.5 text-center">
        {/* Arrows */}
        <button
          aria-label="Previous announcement"
          onClick={() => go(index - 1)}
          className="absolute left-3 grid h-6 w-6 place-items-center rounded-full text-[#efe7d8]/70 transition hover:bg-white/10 hover:text-[#efe7d8]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Sliding track */}
        <div className="relative w-full max-w-2xl overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((a) => (
              <div key={a.id} className="flex min-w-full flex-col items-center gap-y-1 py-0.5 text-[13px] sm:flex-row sm:flex-nowrap sm:gap-x-2 sm:py-0 sm:text-sm">
                <span className="flex items-center justify-center gap-2 text-center leading-snug">
                  {a.highlight && <span className="font-bold uppercase tracking-wide text-white">{a.highlight}</span>}
                  <span className="text-[#efe7d8]/90">{a.text}</span>
                </span>
                <a
                  href={a.href}
                  className="shrink-0 rounded-full bg-[#e8ddc7] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-neutral-900 transition hover:bg-white"
                >
                  {a.buttonLabel}
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Next announcement"
          onClick={() => go(index + 1)}
          className="absolute right-3 grid h-6 w-6 place-items-center rounded-full text-[#efe7d8]/70 transition hover:bg-white/10 hover:text-[#efe7d8]"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
