import { Link } from 'react-router-dom';
import { BUSINESS } from '../config';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap footer-grid">
        <div>
          <h3>
            Joel <span>Cars</span>
          </h3>
          <p>{BUSINESS.tagline}. Honest prices, verified documents and a hassle-free ownership transfer.</p>
        </div>
        <div>
          <h4>Visit our showroom</h4>
          <p>{BUSINESS.address}</p>
          <p>🕘 {BUSINESS.hours}</p>
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapQuery)}`}
          >
            Get directions →
          </a>
        </div>
        <div>
          <h4>Talk to the manager</h4>
          <p>📞 {BUSINESS.phoneDisplay}</p>
          <div className="cta-row">
            <a className="btn btn-yellow" href={`tel:+91${BUSINESS.phone}`}>
              Call Now
            </a>
            <a className="btn btn-green" target="_blank" rel="noreferrer" href={`https://wa.me/${BUSINESS.whatsapp}`}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="copy">
        © {new Date().getFullYear()} Joel Cars. All rights reserved. · <Link to="/admin">Admin</Link>
      </div>
    </footer>
  );
}
