import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 50, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#6c63ff', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ff6584', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
