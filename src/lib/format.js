import { BUSINESS } from '../config';

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const lakh = (n) => {
  const v = Number(n || 0);
  return v >= 100000 ? `₹${(v / 100000).toFixed(2).replace(/\.?0+$/, '')} Lakh` : inr(v);
};

export const km = (n) => (n ? Number(n).toLocaleString('en-IN') + ' km' : '—');

export const waLink = (car) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    car ? `Hi Joel Cars, I'm interested in the ${car.year || ''} ${car.title} (${inr(car.price)}). Is it available?` : 'Hi Joel Cars!'
  )}`;
