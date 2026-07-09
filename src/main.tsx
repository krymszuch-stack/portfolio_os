import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './lib/microsoftAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { WindowProvider } from './contexts/WindowContext';

msalInstance.initialize().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <WindowProvider>
              <App />
            </WindowProvider>
          </AuthProvider>
        </MsalProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}).catch((err) => {
  console.error("Failed to initialize MSAL Instance", err);
  // Rezerwowe renderowanie na wypadek problemów z MSAL
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <WindowProvider>
            <App />
          </WindowProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
});

// Rejestracja Service Workera dla wsparcia PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Pomijamy rejestrację wewnątrz iframe (np. podgląd w AI Studio) oraz na domenach deweloperskich/sandboxach (np. europe-west, run.app) ze względu na przekierowania proxy i ograniczenia ciasteczek/bezpieczeństwa
    const isIframe = window.self !== window.top;
    const isDev = window.location.hostname.includes('localhost') || 
                  window.location.hostname.includes('127.0.0.1') || 
                  window.location.hostname.includes('europe-west') || 
                  window.location.hostname.includes('run.app') || 
                  window.location.hostname.includes('aistudio');
                  
    if (isIframe || isDev) {
      console.log('ℹ AdrianOS: Rejestracja Service Workera pominięta w środowisku deweloperskim / sandboxie.');
      return;
    }

    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✓ AdrianOS Service Worker zarejestrowany pomyślnie:', registration.scope);
      })
      .catch((error) => {
        // Używamy console.warn zamiast console.error, aby nie wyzwalać błędów krytycznych w środowisku dev
        console.warn('⚠️ AdrianOS Rejestracja Service Workera nie powiodła się:', error);
      });
  });
}

