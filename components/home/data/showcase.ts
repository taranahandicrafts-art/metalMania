import { CarouselSlide, ProductAd, Bank, Announcement, ContactLink } from '../types';

const STUDY   = 'https://cvent-be.glean.com/api/v1/downloadchatfile/6bb6be9aed0242f0b54c940cc0a5923b';
const MATTRESS = 'https://cvent-be.glean.com/api/v1/downloadchatfile/e65cfc58a5a04600950b67cb659d9451';
const BEDROOM = 'https://cvent-be.glean.com/api/v1/downloadchatfile/6ec8404548ac4cb986b77c73435051a3';

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
  { id: 'a1', highlight: 'NEW ARRIVALS', text: 'Fresh designs for the season — explore now', href: '/products?new=true', buttonLabel: 'Shop New' },
  { id: 'a2', highlight: 'FREE DELIVERY', text: 'On all orders over ₹5,000 across India', href: '/shipping', buttonLabel: 'Details' },
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
  phoneHref: 'tel:+919876543210',
  phoneDisplay: '+91 98765 43210',
  emailHref: 'mailto:Jangidvikas5524@gmail.com',
  emailDisplay: 'Jangidvikas5524@gmail.com',
  whatsappHref: 'https://wa.me/919876543210',
  facebookHref: 'https://facebook.com/metal_maniahub/',
  instagramHref: 'https://www.instagram.com/metal_maniahub/',
};

/** Sale ends 1d 17h 3m 18s from mount (matches the reference). */
export const SALE_DURATION_MS =
  1 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 3 * 60 * 1000 + 18 * 1000;
