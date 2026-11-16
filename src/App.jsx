import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Icon, { WhatsAppIcon } from './components/Icons';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Admin from './pages/Admin';
import { BUSINESS, DEMO } from './config';
import { waLink } from './lib/format';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      <ScrollTop />
      {DEMO && isAdmin && (
        <div className="demo-banner">Demo mode – data is stored only in this browser. Connect Supabase (see README) to go live.</div>
      )}
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <>
          <a className="wa-float" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
            <WhatsAppIcon size={30} />
          </a>
          <div className="mobile-cta">
            <a className="btn btn-yellow" href={`tel:+91${BUSINESS.phone}`}><Icon name="phone" size={18} /> Call</a>
            <a className="btn btn-wa" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
          </div>
        </>
      )}
    </>
  );
}
