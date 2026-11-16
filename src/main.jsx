import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import { DEMO, SUPABASE_URL } from './config';

if (!DEMO) {
  const l = document.createElement('link');
  l.rel = 'preconnect';
  l.href = SUPABASE_URL;
  l.crossOrigin = '';
  document.head.appendChild(l);
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);
