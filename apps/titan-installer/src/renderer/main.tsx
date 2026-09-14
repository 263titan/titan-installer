import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { ErrorBoundary, ThemeProvider } from '@titan/ui';

const root = createRoot(document.getElementById('root')!);
root.render(
  <ErrorBoundary fallbackTitle="Installer Error" fallbackMessage="An unexpected error occurred. Please try again or reload the application.">
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ErrorBoundary>,
);
