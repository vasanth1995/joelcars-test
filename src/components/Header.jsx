import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BUSINESS } from '../config';
import Icon, { WhatsAppIcon } from './Icons';
import { waLink } from '../lib/format';

export function goSection(navigate, pathname, id) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  if (pathname !== '/') {
    navigate('/');
    setTimeout(scroll, 150);
  } else scroll();
}

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <header className="header">
      <div className="topbar">
        <div className="wrap topbar-in">
          <span><Icon name="pin" size={14} /> Saravanampatti, Coimbatore</span>
          <span className="hide-sm"><Icon name="clock" size={14} /> {BUSINESS.hours}</span>
          <a href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" size={14} /> {BUSINESS.phoneDisplay}</a>
        </div>
      </div>
      <div className="wrap nav">
        <Link to="/" className="brand" aria-label="Joel Cars home">
          <span className="logo-crop"><img src={`${import.meta.env.BASE_URL}logo.webp`} width="138" height="138" alt="" /></span>
          <span className="wordmark"><b>Joel Cars</b><small>Used car dealer</small></span>
        </Link>
        <nav className="links" aria-label="Main">
          <button onClick={() => goSection(navigate, pathname, 'cars')}>Available Cars</button>
          <button onClick={() => goSection(navigate, pathname, 'how')}>How it works</button>
          <button onClick={() => goSection(navigate, pathname, 'sold')}>Happy Owners</button>
          <button onClick={() => goSection(navigate, pathname, 'contact')}>Contact</button>
        </nav>
        <div className="nav-actions">
          <a className="btn btn-wa hide-sm" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
          <a className="btn btn-yellow" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" size={18} /> <span>Call Now</span></a>
        </div>
      </div>
    </header>
  );
}
