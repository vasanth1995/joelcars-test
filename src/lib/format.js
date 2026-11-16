import { BUSINESS, EMI } from '../config';

// Indian digit grouping: ₹4,85,000
export const inr = (n) => '₹' + Math.round(Number(n || 0)).toLocaleString('en-IN');

// Short form buyers expect: ₹4.85 Lakh / ₹1.2 Crore
export const lakh = (n) => {
  const v = Number(n || 0);
  if (v >= 10000000) return `₹${+(v / 10000000).toFixed(2)} Crore`;
  if (v >= 100000) return `₹${+(v / 100000).toFixed(2)} Lakh`;
  return inr(v);
};

export const km = (n) => (n || n === 0 ? Number(n).toLocaleString('en-IN') + ' km' : '');

// Standard reducing-balance EMI formula.
export function emi(price, { rate = EMI.rate, years = EMI.years, downPct = EMI.downPct } = {}) {
  const principal = Number(price || 0) * (1 - downPct / 100);
  const r = rate / 12 / 100;
  const n = years * 12;
  if (!principal) return { monthly: 0, principal: 0, interest: 0 };
  const monthly = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { monthly, principal, interest: monthly * n - principal };
}

export const waLink = (car, text) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    text ||
      (car
        ? `Hi Joel Cars, I'm interested in the ${car.year || ''} ${car.title} (${inr(car.price)}). Is it available?`
        : 'Hi Joel Cars, I want to know about your available cars.')
  )}`;
