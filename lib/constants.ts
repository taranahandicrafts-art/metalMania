export const SITE_NAME = 'Shubharambh Products';
export const SITE_TAGLINE = 'Where quality meet strength';
export const SITE_DESCRIPTION = 'Premium furniture for your home';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+917878245011';
export const WHATSAPP_PREFIX = 'https://wa.me';
export const WHATSAPP_MESSAGE_TEMPLATE = 'Hi, I would like to place an order for:';
export const EMAIL_ADDRESS = 'jangidvikas5524@gmail.com';
export const FACEBOOK_URL = 'https://www.A.com/metal_maniahub/';
export const INSTAGRAM_URL = 'https://www.instagram.com/metal_maniahub/';


export const PHONE_NUMBER = '+917878245011';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const IMAGE = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  MAX_COUNT: 20,
};

export const STOCK = {
  LOW_THRESHOLD_DEFAULT: 10,
};

export const COUPON = {
  MAX_USES_DEFAULT: 100,
};

export const CONTACT = {
  MAX_DAILY_SUBMISSIONS: 5,
};

export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 10,
};
