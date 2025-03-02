import { ThemeProvider } from "@/components/theme-provider";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from "react-error-boundary";
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
