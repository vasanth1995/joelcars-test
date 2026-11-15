import { Link } from 'react-router-dom';
import { inr, km } from '../lib/format';

export default function CarCard({ car }) {
  const isNew = Date.now() - new Date(car.created_at).getTime() < 7 * 864e5;
  return (
    <Link to={`/car/${car.id}`} className="card">
      <div className="card-img">
        <img src={car.images?.[0]} alt={car.title} loading="lazy" />
        {isNew && <span className="badge">NEW</span>}
        <span className="count">📷 {car.images?.length || 0}</span>
      </div>
      <div className="card-body">
        <h3>{car.title}</h3>
        <div className="price">
          {inr(car.price)} <small>Fixed price</small>
        </div>
        <div className="chips">
          {car.year && <span>{car.year}</span>}
          <span>{km(car.km)}</span>
          {car.fuel && <span>{car.fuel}</span>}
          {car.transmission && <span>{car.transmission}</span>}
        </div>
        <div className="meta">
          {car.owner_count && <span>{car.owner_count}</span>}
          <span>📍 {car.location || 'Coimbatore'}</span>
        </div>
      </div>
    </Link>
  );
}
