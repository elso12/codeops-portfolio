import { z } from 'zod';

// Flexible international phone regex (supports +, spaces, dashes, parens, 7 to 20 chars)
const internationalPhoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

// Checkout Form Schema (International)
export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }),
  customerPhone: z.string().trim().regex(internationalPhoneRegex, { 
    message: 'Please enter a valid local or international phone number (e.g., +251 91 123 4567 or +1 555 123 4567)' 
  }),
  deliveryAddress: z.string().trim().min(3, { message: 'Please provide a valid delivery address or seating preference' }),
  paymentMethod: z.enum(['telebirr', 'cbe', 'cash'], {
    errorMap: () => ({ message: 'Please select a payment method' })
  })
});

// Reservation Form Schema (International)
export const reservationSchema = z.object({
  partySize: z.string().min(1, { message: 'Please select party size' }),
  date: z.string().min(1, { message: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time' }),
  seatingPreference: z.string().min(1, { message: 'Please select seating preference' }),
  name: z.string().trim().min(2, { message: 'Contact name is required' }),
  phone: z.string().trim().regex(internationalPhoneRegex, { 
    message: 'Valid local or international phone number required' 
  }),
  specialNotes: z.string().optional()
});

// Auth Login Schema (International)
export const authLoginSchema = z.object({
  email: z.string().trim().min(3, { message: 'Enter your email or phone number (+country code or local)' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' })
});

// Auth Register Schema (International)
export const authRegisterSchema = z.object({
  name: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  phone: z.string().trim().regex(internationalPhoneRegex, { 
    message: 'Enter a valid phone number with optional country code (+251, +1, +44, etc.)' 
  }),
  address: z.string().min(1, { message: 'Select or enter your location/district' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

// Review Submission Schema
export const reviewSchema = z.object({
  author: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  rating: z.number().min(1).max(5, { message: 'Rating must be between 1 and 5' }),
  comment: z.string().trim().min(10, { message: 'Review content must be at least 10 characters' })
});

// Contact Form Schema (International)
export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Valid email is required' }),
  phone: z.string().optional().refine(val => !val || internationalPhoneRegex.test(val), {
    message: 'Invalid phone format (+251..., +1..., etc.)'
  }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' })
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid international email address' })
});
