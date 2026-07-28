'use client';
import React, { useEffect, useState } from 'react';
import { SALE_DURATION_MS } from '../data/showcase';

interface CountdownTimerProps {
  /** Total milliseconds from mount until the sale ends. */
  durationMs?: number;
  /** Or pass an explicit end date (takes precedence over durationMs). */
  endDate?: Date;
}

const pad = (n: number) => n.toString().padStart(2, '0');

const Unit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-extrabold tabular-nums tracking-wider text-[#d1362f]">{pad(value)}</div>
    <div className="mt-0.5 text-xs text-neutral-500">{label}</div>
  </div>
);

const Sep = () => <div className="self-start text-3xl font-extrabold text-[#d1362f]">:</div>;

const CountdownTimer: React.FC<CountdownTimerProps> = ({ durationMs = SALE_DURATION_MS, endDate }) => {
  const [end] = useState(() => (endDate ? endDate.getTime() : Date.now() + durationMs));
  const [remaining, setRemaining] = useState(() => Math.max(0, end - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(id);
  }, [end]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <div className="flex items-end gap-3.5">
      <Unit value={days} label="Days" />
      <Sep />
      <Unit value={hrs} label="Hrs" />
      <Sep />
      <Unit value={mins} label="Mins" />
      <Sep />
      <Unit value={secs} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
