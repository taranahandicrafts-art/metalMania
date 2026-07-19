import { z } from 'zod';

export const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.object({
    line1: z.string().min(5, 'Address is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
    country: z.string().default('India'),
  }),
  notes: z.string().max(2000).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number').optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const addressSchema = z.object({
  line1: z.string().min(5, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
});

export const reviewSchema = z.object({
  product_id: z.string(),
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(200).optional(),
  review: z.string().min(10).max(5000),
  images: z.array(z.string()).max(5).optional(),
});

export const productSchema = z.object({
  title: z.string().min(3).max(200),
  short_description: z.string().min(10).max(500),
  long_description: z.string().max(50000).optional(),
  sku: z.string().min(3).max(50),
  brand: z.string().min(1).max(100),
  base_price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  category_id: z.string(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
