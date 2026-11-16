import { useCallback, useEffect, useState } from 'react';
import { cachedCars, listCars, listSold } from '../lib/api';
import CarCard from '../components/CarCard';
import SoldMarquee from '../components/SoldMarquee';
import Icon, { WhatsAppIcon } from '../components/Icons';
import { ABOUT, BUSINESS, TRUST } from '../config';
import { waLink } from '../lib/format';

const STEPS = [
  ['search', 'Browse online', 'See every photo of each car and its price, from your phone.'],
  ['car', 'Visit & test drive', 'Come to our Saravanampatti showroom and drive the car yourself.'],
  ['key', 'Drive home', 'We help with RC transfer and finance paperwork, then hand over the keys.'],
];

export default function Home() {
  const [cars, setCars] = useState(() => cachedCars()); // instant on repeat visits
  const [sold, setSold] = useState([]);
  const [err, setErr] = useState('');

  const load = useCallback(async (attempt = 0) => {
    setErr('');
    try {
      setCars(await listCars());
    } catch (e) {
      // Ad-blockers or a weak mobile network can fail the first request; retry quietly.
      if (attempt < 2) setTimeout(() => load(attempt + 1), 1500 * (attempt + 1));
      else setErr(e.message || 'Network problem');
    }
  }, []);

  useEffect(() => {
    load();
    listSold().then(setSold).catch(() => {});
  }, [load]);

  const count = cars?.length || 0;

  return (
    <main>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <h1>{ABOUT.heading}</h1>
            <p className="tamil" lang="ta">{ABOUT.tamil}</p>
            <p className="about">{ABOUT.text}</p>
            <div className="cta-row">
              <button className="btn btn-red big" onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}>
                View available cars <Icon name="arrow" size={18} />
              </button>
              <a className="btn btn-yellow big" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" size={18} /> {BUSINESS.phoneDisplay}</a>
              <a className="btn btn-wa big hide-sm" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
            </div>
          </div>
          <img className="hero-logo" src={`${import.meta.env.BASE_URL}logo.webp`} width="260" height="260" alt="" />
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
            {cars && <p className="muted">{count === 0 ? 'New cars are arriving soon' : `${count} car${count === 1 ? '' : 's'} ready to drive home`}</p>}
          </div>
        </div>

        {err && !cars && (
          <div className="notice">
            <b>We could not load the cars.</b>
            <span>Please check your internet connection. If you use an ad-blocker, try turning it off for this site.</span>
            <button className="btn btn-red" onClick={() => load()}>Try again</button>
          </div>
        )}
        {!cars && !err && (
          <div className="car-list">
            {[1, 2].map((n) => <div key={n} className="card row skeleton" />)}
          </div>
        )}
        {cars && count === 0 && (
          <div className="empty">
            <Icon name="car" size={40} />
            <h3>New cars are arriving soon</h3>
            <p>Call or WhatsApp us on {BUSINESS.phoneDisplay} and tell us what you are looking for. We will let you know when it comes in.</p>
            <a className="btn btn-wa" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp us</a>
          </div>
        )}
        <div className="car-list">
          {cars?.map((c, i) => <CarCard key={c.id} car={c} priority={i === 0} />)}
        </div>
        {count > 0 && <p className="fine">*EMI is indicative: 20% down payment, 5 years, 10.5% interest. Actual loan terms depend on the bank.</p>}
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
    </main>
  );
}
