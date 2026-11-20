// src/utils/constants.js

// Developer Hologram & Creator Information (Strictly for Footer Attribution)
export const DEVELOPER_INFO = {
  name: 'Harsh Jha',
  role: 'Full Stack Web Developer & Software Engineer',
  phone: '+91 9075840173',
  phoneClean: '919075840173',
  linkedin: 'https://www.linkedin.com/in/harshjha04/',
  email: 'jhaharsh878@gmail.com',
  tagline: 'Custom Full-Stack Web Development, Modern Glassmorphic UI/UX & Cloud Architecture'
};

// Cascade Villas Concierge Desk Contact Information
export const CONCIERGE_INFO = {
  phone: '+91 7066670757',
  phoneClean: '917066670757',
  email: 'contact@cascadevillas.in',
  whatsapp: '+917066670757',
  hours: '24/7 Guest Assistance'
};

// WhatsApp Business Number for Villa Inquiries
export const WHATSAPP_NUMBER = '+917066670757';

// Locations
export const LOCATIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'Lonavala', label: 'Lonavala' },
  { value: 'Mahabaleshwar', label: 'Mahabaleshwar' }
];

// Bedroom Options
export const BEDROOM_OPTIONS = [
  { value: 'all', label: 'Any Bedrooms' },
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5+ Bedrooms' }
];

// Price Range
export const PRICE_RANGE = {
  min: 0,
  max: 50000,
  step: 1000
};

// Enquiry Status
export const ENQUIRY_STATUS = {
  PENDING: 'pending',
  CONTACTED: 'contacted',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

// Status Colors
export const STATUS_COLORS = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
  contacted: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
  cancelled: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
};

// Amenities Icons
export const AMENITIES_ICONS = {
  'WiFi': '📶',
  'Pool': '🏊',
  'AC': '❄️',
  'Kitchen': '🍳',
  'Parking': '🅿️',
  'TV': '📺',
  'Garden': '🌳',
  'Gym': '💪',
  'Pet Friendly': '🐾',
  'BBQ': '🔥',
  'Balcony': '🏞️',
  'Washing Machine': '🧺'
};

// Sample Villa Images (Placeholders)
export const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
];
