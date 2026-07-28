import { NextRequest, NextResponse } from 'next/server';
import { PromoAd, PromoAdsResponse } from '@/components/home/types';

/* -------------------------------------------------------------------------- */
/* Mock data                                                                  */
/* -------------------------------------------------------------------------- */
const TV_UNIT     = 'https://cvent-be.glean.com/api/v1/downloadchatfile/e698fd2e839e44458e769e63477e206e';
const OFFICE_CHAIR = 'https://cvent-be.glean.com/api/v1/downloadchatfile/2d3d84c82f754b3fa9eea1b5c903807c';
const HOME_TEMPLE = 'https://cvent-be.glean.com/api/v1/downloadchatfile/6d0da2beb4594cb999eb0d8a42cae1f1';

const BROWN = 'bg-[#8a4a29] text-white';
const OLIVE = 'bg-[#7c6f2a] text-white';

/** In a real app this comes from the backend. Kept here only for the mock. */
const MOCK_PROMO_ADS: PromoAdsResponse = {
  title: 'Deals of the Day',
  items: [
    {
      id: 'p1', badge: 'UPTO 45% OFF', badgeClassName: BROWN,
      title: 'TV UNIT', tagline: 'Built to Hold the Drama',
      priceCaption: 'Starting From', price: '₹1,699',
      footnote: 'FREE Delivery Available', image: TV_UNIT,
      href: '/collections/tv-units', bgClassName: 'bg-[#efe9df]',
    },
    {
      id: 'p2', badge: 'UPTO 50% OFF', badgeClassName: OLIVE,
      title: 'OFFICE CHAIR', tagline: 'Ergonomic Excellence',
      priceCaption: 'Starting From', price: '₹4,499',
      footnote: 'ASSEMBLY REQUIRED', image: OFFICE_CHAIR,
      href: '/collections/office-chairs', bgClassName: 'bg-[#efe9df]',
    },
    {
      id: 'p3', badge: 'UPTO 40% OFF', badgeClassName: BROWN,
      title: 'HOME TEMPLE', tagline: 'Sacred Spaces',
      priceCaption: 'Starting From', price: '₹8,999',
      footnote: 'HAND CARVED', image: HOME_TEMPLE,
      href: '/collections/home-temple', bgClassName: 'bg-[#efe9df]',
    },
  ],
};

/**
 * GET /api/promoAds
 * Returns mock promo-ads data. In a real app this would come from a CMS or
 * product feed. Kept here only to make the carousel work out-of-the-box.
 */
export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json(MOCK_PROMO_ADS);
}

// Helper function for the carousel component
export async function fetchPromoAds(signal?: AbortSignal): Promise<PromoAdsResponse> {
  const res = await fetch(new URL('/api/promoAds', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'), {
    signal,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch promo ads');
  return res.json();
}
