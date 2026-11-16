import { Link } from 'react-router-dom';
import { BUSINESS } from '../config';
import { emi, inr, km, lakh, waLink } from '../lib/format';
import Icon, { WhatsAppIcon } from './Icons';

export default function CarCard({ car }) {
  const isNew = Date.now() - new Date(car.created_at).getTime() < 7 * 864e5;
  const m = emi(car.price).monthly;
  const specs = [
    car.year && ['calendar', car.year],
    car.km != null && car.km !== '' && ['gauge', km(car.km)],
    car.fuel && ['fuel', car.fuel],
    car.transmission && ['gear', car.transmission],
  ].filter(Boolean);

  return (
    <article className="card">
      <Link to={`/car/${car.id}`} className="card-link" aria-label={`${car.title}, ${inr(car.price)}`}>
        <div className="card-img">
          <img src={car.images?.[0]} alt={car.title} loading="lazy" />
          {isNew && <span className="badge">Just arrived</span>}
          <span className="count"><Icon name="camera" size={13} /> {car.images?.length || 0}</span>
        </div>
        <div className="card-body">
          <h3>{car.title}</h3>
          <div className="price-row">
            <span className="price">{lakh(car.price)}</span>
            <span className="price-full">{inr(car.price)}</span>
          </div>
          {m > 0 && <div className="emi">EMI from <b>{inr(Math.round(m / 100) * 100)}</b>/month*</div>}
          <ul className="specs-row">
            {specs.map(([ic, v]) => (
              <li key={ic}><Icon name={ic} size={15} /> {v}</li>
            ))}
          </ul>
          <div className="meta">
            {car.owner_count && <span><Icon name="user" size={14} /> {car.owner_count}</span>}
            <span><Icon name="pin" size={14} /> {car.location || 'Coimbatore'}</span>
          </div>
        </div>
      </Link>
      <div className="card-actions">
        <Link to={`/car/${car.id}`} className="btn btn-blue">View details</Link>
        <a className="btn btn-wa icon-only" href={waLink(car)} target="_blank" rel="noreferrer" aria-label="WhatsApp about this car"><WhatsAppIcon /></a>
        <a className="btn btn-outline icon-only" href={`tel:+91${BUSINESS.phone}`} aria-label="Call about this car"><Icon name="phone" /></a>
      </div>
    </article>
  );
}
