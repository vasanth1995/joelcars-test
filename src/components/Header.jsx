import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BUSINESS } from '../config';

export function goSection(navigate, pathname, id) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  if (pathname !== '/') {
    navigate('/');
    setTimeout(scroll, 120);
  } else scroll();
}

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <header className="header">
      <div className="topbar">
        <div className="wrap topbar-in">
          <span>📍 Saravanampatti, Coimbatore</span>
          <span className="hide-sm">🕘 {BUSINESS.hours}</span>
          <a href={`tel:+91${BUSINESS.phone}`}>📞 {BUSINESS.phoneDisplay}</a>
        </div>
      </div>
      <div className="wrap nav">
        <Link to="/" className="brand">
          <span className="logo">J</span>
          <span>
            <b>Joel</b> <i>Cars</i>
            <small>Quality Used Cars</small>
          </span>
        </Link>
        <nav className="links">
          <button onClick={() => goSection(navigate, pathname, 'cars')}>Available Cars</button>
          <button onClick={() => goSection(navigate, pathname, 'sold')}>Sold Cars</button>
          <button onClick={() => goSection(navigate, pathname, 'contact')}>Contact</button>
        </nav>
        <a className="btn btn-yellow nav-call" href={`tel:+91${BUSINESS.phone}`}>
          Call Now
        </a>
      </div>
    </header>
  );
}
