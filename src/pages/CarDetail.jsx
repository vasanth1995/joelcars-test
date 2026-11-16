import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCar, listCars } from '../lib/api';
import Gallery from '../components/Gallery';
import CarCard from '../components/CarCard';
import Icon, { WhatsAppIcon } from '../components/Icons';
import { emi, inr, km, lakh, waLink } from '../lib/format';
import { BUSINESS, EMI } from '../config';

function EmiCalculator({ price }) {
  const [downPct, setDownPct] = useState(EMI.downPct);
  const [years, setYears] = useState(EMI.years);
  const [rate, setRate] = useState(EMI.rate);
  const r = useMemo(() => emi(price, { downPct, years, rate }), [price, downPct, years, rate]);
  return (
    <div className="box emi-box">
      <h3>EMI calculator</h3>
      <div className="emi-result">
        <span>Monthly EMI</span>
        <b>{inr(Math.round(r.monthly))}</b>
      </div>
      <label>Down payment <b>{downPct}%</b> ({inr((price * downPct) / 100)})
        <input type="range" min="10" max="60" step="5" value={downPct} onChange={(e) => setDownPct(+e.target.value)} />
      </label>
      <label>Loan period <b>{years} years</b>
        <input type="range" min="1" max="7" value={years} onChange={(e) => setYears(+e.target.value)} />
      </label>
      <label>Interest rate <b>{rate}%</b> per year
        <input type="range" min="8" max="16" step="0.5" value={rate} onChange={(e) => setRate(+e.target.value)} />
      </label>
      <div className="emi-split">
        <div><small>Loan amount</small><b>{inr(r.principal)}</b></div>
        <div><small>Total interest</small><b>{inr(r.interest)}</b></div>
      </div>
      <p className="fine">Indicative only. Final loan amount, rate and approval are decided by the bank. Ask our manager for finance help.</p>
    </div>
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(undefined);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    setCar(undefined);
    getCar(id).then(setCar).catch(() => setCar(null));
    listCars().then((all) => setOthers(all.filter((c) => c.id !== id).slice(0, 3))).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (car) document.title = `${car.title} – ${inr(car.price)} | Joel Cars`;
    return () => {
      document.title = 'Joel Cars – Buy & Sell Quality Used Cars in Coimbatore';
    };
  }, [car]);

  if (car === undefined)
    return (
      <div className="wrap section">
        <div className="detail-grid">
          <div className="card skeleton tall" />
          <div className="card skeleton tall" />
        </div>
      </div>
    );
  if (!car)
    return (
      <div className="wrap section">
        <div className="empty">
          <Icon name="car" size={40} />
          <h3>This car is no longer available</h3>
          <p>It may have just been sold. Have a look at our other cars.</p>
          <Link className="btn btn-blue" to="/">See available cars</Link>
        </div>
      </div>
    );

  const m = emi(car.price).monthly;
  const facts = [
    car.year && ['calendar', 'Year', car.year],
    car.km != null && car.km !== '' && ['gauge', 'Driven', km(car.km)],
    car.fuel && ['fuel', 'Fuel', car.fuel],
    car.transmission && ['gear', 'Gearbox', car.transmission],
    car.owner_count && ['user', 'Owner', car.owner_count],
  ].filter(Boolean);

  return (
    <main className="wrap section detail">
      <p className="crumbs">
        <Link to="/">Home</Link> <Icon name="right" size={14} /> <Link to="/">Available cars</Link> <Icon name="right" size={14} /> <span>{car.title}</span>
      </p>
      <div className="detail-grid">
        <div>
          <Gallery images={car.images || []} title={car.title} />
          <div className="fact-row">
            {facts.map(([ic, k, v]) => (
              <div key={k} className="fact">
                <Icon name={ic} size={22} />
                <small>{k}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>
          {car.description && (
            <div className="box">
              <h3>About this car</h3>
              <p className="pre">{car.description}</p>
            </div>
          )}
          <div className="box">
            <h3>Details</h3>
            <dl className="specs">
              {[['Brand', car.brand], ['Model', car.title], ['Year', car.year], ['Kilometres driven', km(car.km)], ['Fuel type', car.fuel], ['Transmission', car.transmission], ['Ownership', car.owner_count], ['Location', car.location || 'Coimbatore']]
                .filter((s) => s[1])
                .map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
            </dl>
          </div>
        </div>

        <aside className="side">
          <div className="buy-box">
            <h1>{car.title}</h1>
            <p className="muted">{[car.year, car.fuel, car.transmission].filter(Boolean).join(' • ')}</p>
            <div className="big-price">{inr(car.price)}</div>
            <p className="price-words">{lakh(car.price)} • fixed price</p>
            {m > 0 && <p className="emi">EMI from <b>{inr(Math.round(m / 100) * 100)}</b>/month*</p>}
            <a className="btn btn-yellow full big" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" /> Call manager</a>
            <a className="btn btn-wa full big" href={waLink(car)} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp about this car</a>
            <a
              className="btn btn-outline full"
              href={waLink(car, `Hi Joel Cars, I would like to book a test drive for the ${car.year || ''} ${car.title}. When can I come?`)}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="key" size={18} /> Book a test drive
            </a>
            <div className="visit">
              <span><Icon name="pin" size={16} /> {BUSINESS.address}</span>
              <span><Icon name="clock" size={16} /> {BUSINESS.hours}</span>
            </div>
          </div>
          <EmiCalculator price={Number(car.price)} />
        </aside>
      </div>

      {others.length > 0 && (
        <section className="similar">
          <h2>More cars you may like</h2>
          <div className="grid">
            {others.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      )}
    </main>
  );
}
