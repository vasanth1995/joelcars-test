// Business details – edit here and everything on the site updates.
export const BUSINESS = {
  name: 'Joel Cars',
  tagline: 'Buy & Sell Quality Used Cars',
  phone: '9790165481',
  phoneDisplay: '+91 97901 65481',
  whatsapp: '919790165481',
  address: '1/1-1 Senthil Nagar Extension, Visuvasapuram, Saravanampatti, Coimbatore – 641035',
  hours: 'Monday to Saturday, 9 AM – 8 PM',
  mapQuery: 'Senthil Nagar Extension Saravanampatti Coimbatore 641035',
};

// About text shown at the top of the home page. Edit freely.
export const ABOUT = {
  heading: 'Quality used cars you can trust, in Coimbatore',
  tamil: 'பழைய கார்கள் வாங்க – விற்க',
  text:
    'Joel Cars buys and sells quality pre-owned cars from our showroom in Saravanampatti, Coimbatore. Every car listed here is available with us right now, with real photos and a price you can negotiate. Call or WhatsApp our manager, visit the showroom, take a test drive and decide in person.',
};

// Options offered in the admin form.
export const FEATURES = [
  'Air conditioning', 'Power steering', 'Power windows', 'Music system', 'Touchscreen', 'Bluetooth',
  'Rear camera', 'Airbags', 'ABS', 'Alloy wheels', 'Sunroof', 'Cruise control', 'Keyless entry', 'Central locking',
];

// Promises shown on the site. Change the wording to match exactly what you offer.
export const TRUST = [
  { icon: 'shield', title: 'Checked before listing', text: 'Every car is inspected by us before it goes on the website' },
  { icon: 'file', title: 'Clear documents', text: 'RC, insurance and service records shown to you' },
  { icon: 'rupee', title: 'Negotiable prices', text: 'Talk to our manager and agree a fair price' },
  { icon: 'key', title: 'Test drive welcome', text: 'Visit our showroom and drive before you decide' },
];

// Set in .env (see .env.example). When empty the site runs in local demo mode.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const DEMO = !SUPABASE_URL || !SUPABASE_KEY;

export const SLIDE_MS = 3500; // gallery auto-change interval
