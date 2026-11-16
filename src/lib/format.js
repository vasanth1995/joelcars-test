import { BUSINESS } from '../config';

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

export const waLink = (car, text) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    text ||
      (car
        ? `Hi Joel Cars, I'm interested in the ${car.year || ''} ${car.title} (${inr(car.price)}). Is it available?`
        : 'Hi Joel Cars, I want to know about your available cars.')
  )}`;
