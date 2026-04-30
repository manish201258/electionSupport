import '../styles/globals.css';
import { useEffect } from 'react';
import { logEvent } from '../utils/firebase';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    logEvent('app_open', { source: 'web' });
  }, []);

  return (
    <>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <Component {...pageProps} />
    </>
  );
}
