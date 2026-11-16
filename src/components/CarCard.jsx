import { Link } from 'react-router-dom';
import { BUSINESS } from '../config';
import { inr, km, lakh, waLink } from '../lib/format';
import Icon, { WhatsAppIcon } from './Icons';

export const thumbOf = (car, i = 0) => car.details?.thumbs?.[i] || car.images?.[i];

export default function CarCard({ car, priority = false }) {
  const isNew = Date.now() - new Date(car.created_at).getTime() < 7 * 864e5;
  const d = car.details || {};
  const specs = [
    car.year && ['calendar', car.year],
    car.km != null && car.km !== '' && ['gauge', km(car.km)],
    car.fuel && ['fuel', car.fuel],
    car.transmission && ['gear', car.transmission],
  ].filter(Boolean);
  const feats = (d.features || []).slice(0, 4);
  const more = (d.features || []).length - feats.length;
  const sub = [d.variant, d.color, car.owner_count].filter(Boolean).join(' • ');

  return (
    <article className="card row">
      <Link to={`/car/${car.id}`} className="card-img" aria-label={`View ${car.title}`} tabIndex={-1}>
        <img
          src={thumbOf(car)}
          alt={car.title}
          width="640"
          height="480"
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
        {isNew && <span className="badge">Just arrived</span>}
        <span className="count"><Icon name="camera" size={13} /> {car.images?.length || 0} photos</span>
      </Link>

      <div className="card-main">
        <Link to={`/car/${car.id}`} className="card-title">
          <h3>{car.title}</h3>
          {sub && <p className="muted">{sub}</p>}
        </Link>
        <ul className="specs-row">
          {specs.map(([ic, v]) => (
            <li key={ic}><Icon name={ic} size={16} /> {v}</li>
          ))}
        </ul>
        {feats.length > 0 && (
          <ul className="feats">
            {feats.map((f) => <li key={f}><Icon name="check" size={13} /> {f}</li>)}
            {more > 0 && <li className="more">+{more} more</li>}
          </ul>
        )}
        <div className="assure">
          {d.service === 'Available' && <span><Icon name="file" size={14} /> Service history</span>}
          {d.insurance && <span><Icon name="shield" size={14} /> {d.insurance.split(' ')[0]} insurance</span>}
          <span><Icon name="pin" size={14} /> {car.location || 'Coimbatore'}</span>
        </div>
      </div>

      <div className="card-buy">
        <div className="price">{lakh(car.price)}</div>
        <div className="price-full">{inr(car.price)} • price negotiable</div>
        <div className="card-actions">
          <Link to={`/car/${car.id}`} className="btn btn-red">View details <Icon name="arrow" size={16} /></Link>
          <div className="mini">
            <a className="btn btn-wa" href={waLink(car)} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
            <a className="btn btn-outline" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" size={18} /> Call</a>
          </div>
        </div>
      </div>
    </article>
  );
}
