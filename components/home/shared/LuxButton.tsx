import Link from 'next/link';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'outline' | 'gold' | 'ghost-light';

const base =
  'group/btn relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-8 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-all duration-500 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  solid:
    'bg-lux-ink text-lux-soft ring-offset-lux-soft hover:bg-lux-charcoal',
  gold:
    'bg-lux-gold text-lux-ink ring-offset-lux-soft hover:bg-lux-gold-dark hover:text-lux-soft',
  outline:
    'border border-lux-ink/25 text-lux-ink ring-offset-lux-soft hover:border-lux-ink hover:bg-lux-ink hover:text-lux-soft',
  'ghost-light':
    'border border-lux-soft/30 text-lux-soft ring-offset-lux-ink hover:border-lux-soft hover:bg-lux-soft hover:text-lux-ink',
};

interface LuxButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}

/** Shared marketing button with a soft sheen sweep on hover. */
export function LuxButton({
  href,
  children,
  variant = 'solid',
  className,
  external,
  ariaLabel,
}: LuxButtonProps) {
  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(base, variants[variant], className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}
