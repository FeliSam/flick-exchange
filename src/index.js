import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransferProvider } from './context/TransferContext';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <AuthProvider>
      <TransferProvider>
        <App />
      </TransferProvider>
    </AuthProvider>
  </HashRouter>
);
