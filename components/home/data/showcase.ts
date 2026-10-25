import { CarouselSlide, ProductAd, Bank, Announcement, ContactLink } from '../types';
import {
  EMAIL_ADDRESS,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  WHATSAPP_PREFIX,
} from '@/lib/constants';

// Placeholder photography (Unsplash, free to use) until the client supplies
// their own. Products tagged "hero-carousel" in the admin replace these slides.
const STUDY   = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070';
const MATTRESS = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070';
const BEDROOM = 'https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=2000';

export const CATEGORIES: string[] = [ 'All',
  'Sofas', 'Living', 'Bedroom', 'Mattress', 'Dining', 'Storage',
  'Study & Office', 'Outdoor', 'Decor & Furnishing', 'Interiors', 'New Arrivals',
];

export const SLIDES: CarouselSlide[] = [
  { id: 's1', image: STUDY,   titleLine1: 'FRESH', titleLine2: 'Finds', accentWord: 'July',
    subtitle: 'Study Tables', price: 'Starting From ₹1,169', terms: 'T&C Apply*' },
  { id: 's2', image: BEDROOM, titleLine1: 'Rest', titleLine2: '&', accentWord: 'Restore',
    subtitle: 'Beds & Bedroom Sets', price: 'Starting From ₹9,999', terms: 'T&C Apply*' },
  { id: 's3', image: MATTRESS, titleLine1: 'Sleep', titleLine2: '', accentWord: 'Season',
    subtitle: 'Premium Mattresses', price: 'Starting From ₹5,599', terms: 'T&C Apply*' },
];

export const ADS: ProductAd[] = [
  { id: 'ad1', image: MATTRESS, title: 'Sleep. Sink. Snooze.',
    subtitle: 'Comfort that adapts to every move you make',
    label: 'Mattresses', priceCaption: 'Starting From', price: '₹5,599*', terms: 'T&C Apply*' },
  { id: 'ad2', image: BEDROOM, title: 'MASSIVE PRICE DROP', serifTitle: true,
    subtitle: 'Limited Time Deal', italicSubtitle: true,
    label: 'Calmora Bed', oldPrice: '₹24,999', nowPrice: '₹19,999' },
];

export const BANKS: Bank[] = [
  { name: 'ICICI Bank', className: 'bg-[#f6683d] text-white' },
  { name: 'AXIS BANK',  className: 'bg-[#97144d] text-white' },
  { name: 'HDFC BANK',  className: 'bg-[#004c8f] text-white' },
  { name: 'YES BANK',   className: 'bg-[#00518f] text-white' },
  { name: 'kotak',      className: 'bg-[#ed232a] text-white' },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', highlight: 'NEW ARRIVALS', text: 'Fresh designs for the season — explore now', href: '/products?is_new_arrival=true', buttonLabel: 'Shop New' },
];

export const CONTACT: ContactLink & {
  phoneHref: string;
  phoneDisplay: string;
  emailHref: string;
  emailDisplay: string;
  whatsappHref: string;
  facebookHref: string;
  instagramHref: string;
} = {
  id: 'contact',
  label: 'Contact',
  href: '/contact',
  icon: null as any,
  // Single source of truth for contact details lives in lib/constants.
  phoneHref: `tel:${PHONE_NUMBER.replace(/\s/g, '')}`,
  phoneDisplay: PHONE_NUMBER.replace(/^\+91(\d{5})(\d{5})$/, '+91 $1 $2'),
  emailHref: `mailto:${EMAIL_ADDRESS}`,
  emailDisplay: EMAIL_ADDRESS,
  whatsappHref: `${WHATSAPP_PREFIX}/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`,
  facebookHref: FACEBOOK_URL,
  instagramHref: INSTAGRAM_URL,
};

/** Sale ends 1d 17h 3m 18s from mount (matches the reference). */
export const SALE_DURATION_MS =
  1 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 3 * 60 * 1000 + 18 * 1000;
