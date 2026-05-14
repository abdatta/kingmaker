import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker (auto-updates in production)
if (typeof window !== 'undefined') {
  registerSW({ immediate: true });
}

// Vite injects BASE_URL from vite.config's `base` (e.g. '/' locally,
// '/kingmaker-demo/' on GitHub Pages). React Router needs a basename
// WITHOUT the trailing slash, except when it's just '/'.
const baseUrl = import.meta.env.BASE_URL || '/';
const basename = baseUrl === '/' ? '/' : baseUrl.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
