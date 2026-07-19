import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * Editorial section heading — a small tracked eyebrow, a serif display title,
 * and an optional lede. The shared voice for every marketing section.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'dark',
  className,
}: SectionHeadingProps) {
  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              'flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em]',
              align === 'center' && 'justify-center',
              isLight ? 'text-lux-parchment' : 'text-lux-gold',
            )}
          >
            <span className={cn('h-px w-8', isLight ? 'bg-lux-parchment/50' : 'bg-lux-gold/50')} />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            'mt-5 font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.4rem]',
            isLight ? 'text-lux-soft' : 'text-lux-ink',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-6 text-base leading-relaxed text-balance sm:text-lg',
              align === 'center' && 'mx-auto max-w-xl',
              isLight ? 'text-lux-sand/80' : 'text-lux-stone',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
