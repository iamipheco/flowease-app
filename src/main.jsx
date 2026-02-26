import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { useUIStore } from './store/uiStore';
import App from './App';
import './index.css';


// Initialize theme on app load
const initializeTheme = () => {
  const storedTheme = localStorage.getItem('ui-storage');
  if (storedTheme) {
    try {
      const { state } = JSON.parse(storedTheme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Default to dark
      document.documentElement.classList.add('dark');
    }
  } else {
    // Default to dark
    document.documentElement.classList.add('dark');
  }
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a0f0a',
              border: '1px solid #4a2f1f',
              color: '#f8f4f0',
            },
          }}
        />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);