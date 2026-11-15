import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCar } from '../lib/api';
import Gallery from '../components/Gallery';
import { inr, km, waLink } from '../lib/format';
import { BUSINESS } from '../config';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(undefined);

  useEffect(() => {
    getCar(id).then(setCar).catch(() => setCar(null));
  }, [id]);

  useEffect(() => {
    if (car) document.title = `${car.title} – ${inr(car.price)} | Joel Cars`;
    return () => (document.title = 'Joel Cars – Buy & Sell Quality Used Cars in Coimbatore');
  }, [car]);

  if (car === undefined) return <div className="wrap section"><p className="muted">Loading…</p></div>;
  if (!car)
    return (
      <div className="wrap section empty">
        <h3>This car is no longer available</h3>
        <p>It may have just been sold.</p>
        <Link className="btn btn-blue" to="/">See other cars</Link>
      </div>
    );

  const specs = [
    ['Year', car.year],
    ['Kilometres driven', km(car.km)],
    ['Fuel', car.fuel],
    ['Transmission', car.transmission],
    ['Ownership', car.owner_count],
    ['Brand', car.brand],
    ['Location', car.location || 'Coimbatore'],
  ].filter((s) => s[1] && s[1] !== '—');

  return (
    <main className="wrap section detail">
      <p className="crumbs">
        <Link to="/">Home</Link> › <Link to="/">Available Cars</Link> › {car.title}
      </p>
      <div className="detail-grid">
        <div>
          <Gallery images={car.images || []} title={car.title} />
          {car.description && (
            <div className="box">
              <h3>About this car</h3>
              <p className="pre">{car.description}</p>
            </div>
          )}
          <div className="box">
            <h3>Specifications</h3>
            <dl className="specs">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <aside className="buy-box">
          <h1>{car.title}</h1>
          <p className="muted">
            {[car.year, car.fuel, car.transmission].filter(Boolean).join(' • ')}
          </p>
          <div className="big-price">{inr(car.price)}</div>
          <p className="muted small">Fixed price • RC transfer & finance assistance available</p>
          <a className="btn btn-yellow full" href={`tel:+91${BUSINESS.phone}`}>
            📞 Call Manager – {BUSINESS.phoneDisplay}
          </a>
          <a className="btn btn-green full" href={waLink(car)} target="_blank" rel="noreferrer">
            💬 WhatsApp about this car
          </a>
          <div className="visit">
            <b>Visit & test drive</b>
            <span>{BUSINESS.address}</span>
            <span>🕘 {BUSINESS.hours}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
