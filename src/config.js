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

// Promises shown on the site. Change the wording to match exactly what you offer.
export const TRUST = [
  { icon: 'shield', title: 'Checked before listing', text: 'Every car is inspected by us before it goes on the website' },
  { icon: 'file', title: 'Clear documents', text: 'RC, insurance and service records shown to you' },
  { icon: 'rupee', title: 'Fixed, honest prices', text: 'The price you see is the price you discuss' },
  { icon: 'key', title: 'Test drive welcome', text: 'Visit our showroom and drive before you decide' },
];

// Indicative EMI shown on car cards and the calculator (not a loan offer).
export const EMI = { rate: 10.5, years: 5, downPct: 20 };

export const BUDGETS = [
  { label: 'Under ₹3 Lakh', min: 0, max: 300000 },
  { label: '₹3 – 5 Lakh', min: 300000, max: 500000 },
  { label: '₹5 – 8 Lakh', min: 500000, max: 800000 },
  { label: '₹8 – 12 Lakh', min: 800000, max: 1200000 },
  { label: 'Above ₹12 Lakh', min: 1200000, max: Infinity },
];

// Set in .env (see .env.example). When empty the site runs in local demo mode.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const DEMO = !SUPABASE_URL || !SUPABASE_KEY;

export const SLIDE_MS = 3500; // gallery auto-change interval
