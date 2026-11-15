import { useEffect, useMemo, useState } from 'react';
import { listCars, listSold } from '../lib/api';
import CarCard from '../components/CarCard';
import SoldMarquee from '../components/SoldMarquee';
import { BUSINESS } from '../config';

const TRUST = [
  ['✅', 'Quality Checked', 'Every car inspected before listing'],
  ['📄', 'Clear Papers', 'RC, insurance & service history verified'],
  ['💰', 'Best Price', 'Fair, fixed prices – no hidden charges'],
  ['🔁', 'Easy Transfer', 'We help with RC transfer & finance'],
];

export default function Home() {
  const [cars, setCars] = useState(null);
  const [sold, setSold] = useState([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    listCars().then(setCars).catch((e) => setErr(e.message));
    listSold().then(setSold).catch(() => {});
  }, []);

  const brands = useMemo(() => ['All', ...new Set((cars || []).map((c) => c.brand).filter(Boolean))], [cars]);
  const fuels = useMemo(() => ['All', ...new Set((cars || []).map((c) => c.fuel).filter(Boolean))], [cars]);

  const shown = useMemo(() => {
    let r = (cars || []).filter(
      (c) =>
        (brand === 'All' || c.brand === brand) &&
        (fuel === 'All' || c.fuel === fuel) &&
        (c.title + ' ' + c.brand).toLowerCase().includes(q.toLowerCase())
    );
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [cars, q, brand, fuel, sort]);

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <span className="pill">Coimbatore's trusted used car dealer</span>
            <h1>
              Drive home your <em>dream car</em> at the right price
            </h1>
            <p>Hand-picked, quality-checked pre-owned cars with genuine papers. See real photos, then call or WhatsApp our manager.</p>
            <div className="cta-row">
              <button className="btn btn-yellow big" onClick={() => document.getElementById('cars').scrollIntoView({ behavior: 'smooth' })}>
                View Available Cars
              </button>
              <a className="btn btn-ghost big" href={`tel:+91${BUSINESS.phone}`}>
                📞 {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap trust">
        {TRUST.map(([i, t, d]) => (
          <div key={t}>
            <span>{i}</span>
            <b>{t}</b>
            <small>{d}</small>
          </div>
        ))}
      </section>

      <section className="wrap section" id="cars">
        <div className="sec-head">
          <h2>Available Cars For Sale</h2>
          {cars && <span className="muted">{shown.length} car{shown.length !== 1 && 's'}</span>}
        </div>

        <div className="filters">
          <input type="search" placeholder="🔍 Search by brand or model…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
            {brands.map((b) => (
              <option key={b}>{b === 'All' ? 'All brands' : b}</option>
            ))}
          </select>
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} aria-label="Fuel">
            {fuels.map((b) => (
              <option key={b}>{b === 'All' ? 'All fuels' : b}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Newest first</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {err && <p className="error">Could not load cars: {err}</p>}
        {!cars && !err && (
          <div className="grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card skeleton" />
            ))}
          </div>
        )}
        {cars && shown.length === 0 && (
          <div className="empty">
            <h3>No cars match right now</h3>
            <p>New cars arrive often – call us on {BUSINESS.phoneDisplay} and tell us what you need.</p>
          </div>
        )}
        <div className="grid">
          {shown.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      </section>

      {sold.length > 0 && (
        <section className="sold-section" id="sold">
          <div className="wrap sec-head center">
            <h2>Recently Sold – Happy Customers</h2>
            <p className="muted">Join the families who found their car with Joel Cars</p>
          </div>
          <SoldMarquee items={sold} />
        </section>
      )}
    </main>
  );
}
