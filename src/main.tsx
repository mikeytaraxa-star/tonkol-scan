import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Initialize TG Analytics lazily so it can never break initial render
void (async () => {
  try {
    const hasTelegramWebApp =
      typeof window !== 'undefined' &&
      // @ts-expect-error - Telegram WebApp is injected at runtime
      !!window.Telegram?.WebApp;

    if (!hasTelegramWebApp) return;

    const { default: TelegramAnalytics } = await import('@telegram-apps/analytics');
    TelegramAnalytics.init({
      token:
        'eyJhcHBfbmFtZSI6IlRvbmtvbCIsImFwcF91cmwiOiJodHRwczovL3QubWUvdG9uY29pbmtvbF9ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly90b25rb2wucHJvLyJ9!06TTc/hN3Gm7A/xzShFxSN6yACA2Oiy+pROtKS9PU+U=',
      appName: 'Tonkol',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('TelegramAnalytics init skipped:', e);
  }
})();

