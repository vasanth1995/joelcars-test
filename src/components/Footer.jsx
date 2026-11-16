import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS } from '../config';
import Icon, { WhatsAppIcon } from './Icons';
import { waLink } from '../lib/format';

function LazyMap() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return setShow(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), io.disconnect()), { rootMargin: '300px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="map" ref={ref}>
      {show ? (
        <iframe
          title="Joel Cars location"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapQuery)}&output=embed`}
        />
      ) : (
        <div className="map-ph"><Icon name="map" size={34} /><span>Map loading…</span></div>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <span className="eyebrow">Visit us</span>
          <h2>Come see the cars in person</h2>
          <ul className="info-list">
            <li><Icon name="pin" /> <span>{BUSINESS.address}</span></li>
            <li><Icon name="clock" /> <span>{BUSINESS.hours}</span></li>
            <li><Icon name="phone" /> <a href={`tel:+91${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a></li>
          </ul>
          <div className="cta-row">
            <a className="btn btn-yellow big" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" /> Call the manager</a>
            <a className="btn btn-wa big" target="_blank" rel="noreferrer" href={waLink()}><WhatsAppIcon /> WhatsApp</a>
          </div>
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapQuery)}`}
          >
            Open in Google Maps <Icon name="arrow" size={16} />
          </a>
        </div>
        <LazyMap />
      </div>
      <div className="copy">
        <div className="wrap copy-in">
          <span>© {new Date().getFullYear()} Joel Cars, Coimbatore. All rights reserved.</span>
          <Link to="/admin"><Icon name="lock" size={13} /> Admin</Link>
        </div>
      </div>
    </footer>
  );
}
