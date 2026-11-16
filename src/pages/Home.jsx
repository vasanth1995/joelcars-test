import { useCallback, useEffect, useMemo, useState } from 'react';
import { listCars, listSold } from '../lib/api';
import CarCard from '../components/CarCard';
import SoldMarquee from '../components/SoldMarquee';
import Icon from '../components/Icons';
import { BUSINESS, BUDGETS, TRUST } from '../config';

const STEPS = [
  ['search', 'Browse online', 'See every photo of each car and the price, from your phone.'],
  ['car', 'Visit & test drive', 'Come to our Saravanampatti showroom and drive the car yourself.'],
  ['key', 'Drive home', 'We help with RC transfer and finance paperwork, then hand over the keys.'],
];

const toCars = (n) => `${n} car${n === 1 ? '' : 's'}`;

export default function Home() {
  const [cars, setCars] = useState(null);
  const [sold, setSold] = useState([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [budget, setBudget] = useState(-1);
  const [sort, setSort] = useState('new');

  const load = useCallback(async (attempt = 0) => {
    setErr('');
    try {
      setCars(await listCars());
      listSold().then(setSold).catch(() => {});
    } catch (e) {
      // Ad-blockers or a weak mobile network can fail the first request; try again quietly.
      if (attempt < 2) setTimeout(() => load(attempt + 1), 1500 * (attempt + 1));
      else setErr(e.message || 'Network problem');
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const brands = useMemo(() => [...new Set((cars || []).map((c) => c.brand).filter(Boolean))], [cars]);
  const fuels = useMemo(() => [...new Set((cars || []).map((c) => c.fuel).filter(Boolean))], [cars]);

  const shown = useMemo(() => {
    const b = BUDGETS[budget];
    let r = (cars || []).filter(
      (c) =>
        (brand === 'All' || c.brand === brand) &&
        (fuel === 'All' || c.fuel === fuel) &&
        (!b || (c.price >= b.min && c.price < b.max)) &&
        (c.title + ' ' + c.brand).toLowerCase().includes(q.trim().toLowerCase())
    );
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [cars, q, brand, fuel, budget, sort]);

  const filtered = q || brand !== 'All' || fuel !== 'All' || budget >= 0;
  const reset = () => {
    setQ('');
    setBrand('All');
    setFuel('All');
    setBudget(-1);
  };
  const toList = () => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="pill"><Icon name="pin" size={14} /> Trusted used car showroom in Coimbatore</span>
            <h1>
              Find the right used car, <em>at a fair price</em>
            </h1>
            <p>Real photos of every car, clear prices and a showroom you can walk into. Call or WhatsApp our manager any time between 9 AM and 8 PM.</p>
            <ul className="hero-points">
              <li><Icon name="check" size={16} /> Fixed, transparent prices</li>
              <li><Icon name="check" size={16} /> Test drive at our showroom</li>
              <li><Icon name="check" size={16} /> RC transfer &amp; finance help</li>
            </ul>
          </div>

          <form className="finder" onSubmit={(e) => { e.preventDefault(); toList(); }}>
            <h2>Find your car</h2>
            <label>Budget
              <select value={budget} onChange={(e) => setBudget(+e.target.value)}>
                <option value={-1}>Any budget</option>
                {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
              </select>
            </label>
            <label>Brand
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="All">All brands</option>
                {brands.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label>Fuel
              <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                <option value="All">Any fuel</option>
                {fuels.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <button className="btn btn-yellow big full"><Icon name="search" size={18} /> {cars ? `Show ${toCars(shown.length)}` : 'Search cars'}</button>
          </form>
        </div>
      </section>

      <section className="wrap trust" aria-label="Why buy from Joel Cars">
        {TRUST.map((t) => (
          <div key={t.title} className="trust-item">
            <span className="trust-ic"><Icon name={t.icon} size={22} /></span>
            <div>
              <b>{t.title}</b>
              <small>{t.text}</small>
            </div>
          </div>
        ))}
      </section>

      <section className="wrap section" id="cars">
        <div className="sec-head">
          <div>
            <h2>Available cars</h2>
            {cars && <p className="muted">{toCars(shown.length)} {filtered ? 'match your search' : 'ready to drive home'}</p>}
          </div>
          <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort cars">
            <option value="new">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>

        <div className="budget-chips" role="group" aria-label="Filter by budget">
          <button className={budget < 0 ? 'on' : ''} onClick={() => setBudget(-1)}>All</button>
          {BUDGETS.map((b, i) => (
            <button key={b.label} className={budget === i ? 'on' : ''} onClick={() => setBudget(budget === i ? -1 : i)}>{b.label}</button>
          ))}
        </div>

        <div className="searchbox">
          <Icon name="search" size={18} />
          <input type="search" placeholder="Search by car name or brand" value={q} onChange={(e) => setQ(e.target.value)} />
          {filtered && <button type="button" className="clear" onClick={reset}>Clear filters</button>}
        </div>

        {err && (
          <div className="notice">
            <b>We could not load the cars.</b>
            <span>Please check your internet connection. If you use an ad-blocker, try turning it off for this site.</span>
            <button className="btn btn-blue" onClick={() => load()}>Try again</button>
          </div>
        )}
        {!cars && !err && (
          <div className="grid">
            {[1, 2, 3].map((n) => <div key={n} className="card skeleton" />)}
          </div>
        )}
        {cars && shown.length === 0 && (
          <div className="empty">
            <Icon name="car" size={40} />
            <h3>{cars.length ? 'No cars match your search' : 'New cars are arriving soon'}</h3>
            <p>Call or WhatsApp us on {BUSINESS.phoneDisplay} and tell us what you are looking for. We will let you know when it comes in.</p>
            {filtered && <button className="btn btn-blue" onClick={reset}>Show all cars</button>}
          </div>
        )}
        <div className="grid">
          {shown.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
        {shown.length > 0 && <p className="fine">*EMI is indicative: {20}% down payment, 5 years, 10.5% interest. Actual loan terms depend on the bank.</p>}
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <div className="sec-head center">
            <div>
              <h2>Buying a car, made simple</h2>
              <p className="muted">Three easy steps from browsing to driving home</p>
            </div>
          </div>
          <div className="steps">
            {STEPS.map(([ic, t, d], i) => (
              <div key={t} className="step">
                <span className="step-n">{i + 1}</span>
                <Icon name={ic} size={28} />
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sold.length > 0 && (
        <section className="sold-section" id="sold">
          <div className="wrap sec-head center">
            <div>
              <h2>Happy owners</h2>
              <p className="muted">Families who found their car with Joel Cars</p>
            </div>
          </div>
          <SoldMarquee items={sold} />
        </section>
      )}
    </main>
  );
}
