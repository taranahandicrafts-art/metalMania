export interface CarouselSlide {
  id: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  accentWord: string;      // rendered in italic amber
  subtitle: string;
  price: string;           // e.g. "Starting From ₹1,169"
  terms?: string;
}

export interface ProductAd {
  id: string;
  image: string;
  title: string;
  serifTitle?: boolean;    // use serif font (e.g. "MASSIVE PRICE DROP")
  subtitle?: string;
  italicSubtitle?: boolean;
  label?: string;          // small label above price (e.g. "Mattresses")
  priceCaption?: string;   // e.g. "Starting From"
  price?: string;          // e.g. "₹5,599*"
  oldPrice?: string;       // struck-through price
  nowPrice?: string;       // shown in dark pill
  terms?: string;
}

export interface Bank {
  name: string;
  className: string;       // tailwind bg/text classes for the pill
}

export interface Benefit {
  id: string;
  icon: React.ReactNode;
  line1: string;
  line2: string;
}

export interface Announcement {
  id: string;
  highlight?: string;
  text: string;
  href: string;
  buttonLabel: string;
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Promo Ads types
export interface PromoAd {
  id: string;
  badge: string;
  badgeClassName?: string;
  title: string;
  tagline: string;
  priceCaption?: string;
  price: string;
  footnote?: string;
  image: string;
  href: string;
  bgClassName?: string;
}

export interface PromoAdsResponse {
  title: string;
  items: PromoAd[];
}
