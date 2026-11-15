import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Admin from './pages/Admin';
import { BUSINESS, DEMO } from './config';

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
        <a
          className="wa-float"
          href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi Joel Cars, I want to know about your available cars.')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.4.7 4.7 1.9 6.600L3.200 29l7.100-2.100c1.800 1 3.700 1.500 5.700 1.500 6.900 0 12.600-5.600 12.600-12.500S22.900 3 16 3zm0 22.800c-1.800 0-3.600-.5-5.100-1.400l-.4-.2-4.200 1.200 1.200-4.100-.3-.4a10 10 0 0 1-1.600-5.400C5.600 10 10.300 5.400 16 5.400s10.400 4.600 10.400 10.200S21.700 25.800 16 25.800zm5.700-7.500c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.400 8.400 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100 2.100 3.300 5.200 4.600c1.900.8 2.700.9 3.600.8.600-.1 1.800-.7 2.100-1.400s.3-1.300.2-1.400-.3-.2-.6-.4z"/></svg>
        </a>
      )}
    </>
  );
}
