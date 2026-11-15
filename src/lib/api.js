import { createClient } from '@supabase/supabase-js';
import { DEMO, SUPABASE_URL, SUPABASE_KEY } from '../config';

const BUCKET = 'car-images';
const sb = DEMO ? null : createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------- image helpers ---------- */

// Resize + re-encode in the browser so uploads are small (saves free storage, loads fast).
export async function compressImage(file, maxSide = 1600, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((res) => canvas.toBlob((b) => res(b), 'image/jpeg', quality));
}

const blobToDataUrl = (blob) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

async function uploadImages(files, folder) {
  const urls = [];
  const paths = [];
  for (const f of files) {
    if (DEMO) {
      const blob = await compressImage(f, 900, 0.7);
      urls.push(await blobToDataUrl(blob));
      paths.push('');
    } else {
      const blob = await compressImage(f);
      const path = `${folder}/${uid()}.jpg`;
      const { error } = await sb.storage.from(BUCKET).upload(path, blob, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
      });
      if (error) throw error;
      urls.push(sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      paths.push(path);
    }
  }
  return { urls, paths };
}

/* ---------- demo-mode storage ---------- */

const demoSvg = (a, b, label) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><g fill="#fff" fill-opacity=".92"><path d="M250 520l80-170c14-28 40-45 70-45h400c30 0 56 17 70 45l80 170v110h-80v-50H330v50h-80z"/></g><circle cx="360" cy="560" r="48" fill="#111"/><circle cx="840" cy="560" r="48" fill="#111"/><text x="600" y="190" font-family="Arial" font-size="54" font-weight="700" fill="#fff" text-anchor="middle">${label}</text><text x="600" y="750" font-family="Arial" font-size="28" fill="#fff" fill-opacity=".8" text-anchor="middle">Demo photo – upload real photos from the Admin panel</text></svg>`
  );

const seedCars = () => {
  const mk = (id, title, brand, year, price, km, fuel, transmission, owner_count, c1, c2) => ({
    id,
    title,
    brand,
    year,
    price,
    km,
    fuel,
    transmission,
    owner_count,
    location: 'Coimbatore',
    description:
      'Well maintained, single-hand use, all service records available. Insurance valid. Test drive available at our showroom – call or WhatsApp to book.',
    images: [1, 2, 3, 4, 5, 6].map((n) => demoSvg(c1, c2, `${title} • ${n}/6`)),
    image_paths: [],
    created_at: new Date().toISOString(),
  });
  return [
    mk('d1', 'Maruti Suzuki Swift VXi', 'Maruti Suzuki', 2019, 485000, 42000, 'Petrol', 'Manual', '1st Owner', '#c62828', '#7f1d1d'),
    mk('d2', 'Hyundai Creta SX', 'Hyundai', 2018, 895000, 61000, 'Diesel', 'Manual', '1st Owner', '#1565c0', '#0b2a6f'),
    mk('d3', 'Honda City ZX', 'Honda', 2017, 625000, 54000, 'Petrol', 'Automatic', '2nd Owner', '#455a64', '#1c2a31'),
  ];
};
const seedSold = () =>
  [
    ['#2e7d32', '#14471a', 'Toyota Innova – Sold'],
    ['#6a1b9a', '#37104f', 'Ford EcoSport – Sold'],
    ['#ef6c00', '#8a3b00', 'Tata Nexon – Sold'],
    ['#00838f', '#00464d', 'Kia Seltos – Sold'],
  ].map((x, i) => ({
    id: 's' + i,
    caption: x[2].replace(' – Sold', ''),
    image_url: demoSvg(x[0], x[1], x[2]),
    image_path: '',
    created_at: new Date().toISOString(),
  }));

const ls = {
  get(k, seed) {
    try {
      const v = localStorage.getItem(k);
      if (v) return JSON.parse(v);
    } catch {}
    const s = seed();
    ls.set(k, s);
    return s;
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      throw new Error('Demo storage is full. Use fewer/smaller photos in demo mode (Supabase has no such limit).');
    }
  },
};

/* ---------- public API ---------- */

export async function listCars() {
  if (DEMO) return ls.get('jc_cars', seedCars);
  const { data, error } = await sb.from('cars').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCar(id) {
  if (DEMO) return (await listCars()).find((c) => c.id === id) || null;
  const { data, error } = await sb.from('cars').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listSold() {
  if (DEMO) return ls.get('jc_sold', seedSold);
  const { data, error } = await sb.from('sold_cars').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addCar(fields, files) {
  const { urls, paths } = await uploadImages(files, 'cars');
  const row = { ...fields, images: urls, image_paths: paths };
  if (DEMO) {
    const cars = ls.get('jc_cars', seedCars);
    ls.set('jc_cars', [{ ...row, id: uid(), created_at: new Date().toISOString() }, ...cars]);
    return;
  }
  const { error } = await sb.from('cars').insert(row);
  if (error) {
    await removeFiles(paths);
    throw error;
  }
}

async function removeFiles(paths) {
  const real = (paths || []).filter(Boolean);
  if (!DEMO && real.length) await sb.storage.from(BUCKET).remove(real);
}

// Deleting a sold car removes the row AND every photo from storage.
export async function deleteCar(car) {
  if (DEMO) {
    ls.set('jc_cars', ls.get('jc_cars', seedCars).filter((c) => c.id !== car.id));
    return;
  }
  await removeFiles(car.image_paths);
  const { error } = await sb.from('cars').delete().eq('id', car.id);
  if (error) throw error;
}

export async function addSold(files, caption) {
  const { urls, paths } = await uploadImages(files, 'sold');
  const rows = urls.map((u, i) => ({ caption: caption || '', image_url: u, image_path: paths[i] }));
  if (DEMO) {
    const cur = ls.get('jc_sold', seedSold);
    ls.set('jc_sold', [...rows.map((r) => ({ ...r, id: uid(), created_at: new Date().toISOString() })), ...cur]);
    return;
  }
  const { error } = await sb.from('sold_cars').insert(rows);
  if (error) {
    await removeFiles(paths);
    throw error;
  }
}

export async function deleteSold(item) {
  if (DEMO) {
    ls.set('jc_sold', ls.get('jc_sold', seedSold).filter((c) => c.id !== item.id));
    return;
  }
  await removeFiles([item.image_path]);
  const { error } = await sb.from('sold_cars').delete().eq('id', item.id);
  if (error) throw error;
}

/* ---------- admin auth ---------- */

export const DEMO_PASSWORD = 'admin123';

export async function getSession() {
  if (DEMO) return sessionStorage.getItem('jc_admin') ? { email: 'demo-admin' } : null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function login(email, password) {
  if (DEMO) {
    if (password !== DEMO_PASSWORD) throw new Error('Wrong password (demo password is admin123).');
    sessionStorage.setItem('jc_admin', '1');
    return;
  }
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function logout() {
  if (DEMO) return sessionStorage.removeItem('jc_admin');
  await sb.auth.signOut();
}
