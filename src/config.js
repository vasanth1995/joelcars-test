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

// Set in .env (see .env.example). When empty the site runs in local demo mode.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const DEMO = !SUPABASE_URL || !SUPABASE_KEY;

export const SLIDE_MS = 3500; // gallery auto-change interval
