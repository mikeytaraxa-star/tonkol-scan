import React from 'react'
import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import App from './App.tsx'
import './index.css'
import TelegramAnalytics from '@telegram-apps/analytics'

// Initialize TG Analytics
TelegramAnalytics.init({
  token: 'eyJhcHBfbmFtZSI6IlRvbmtvbCIsImFwcF91cmwiOiJodHRwczovL3QubWUvdG9uY29pbmtvbF9ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly90b25rb2wucHJvLyJ9!06TTc/hN3Gm7A/xzShFxSN6yACA2Oiy+pROtKS9PU+U=',
  appName: 'Tonkol',
});

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
)
