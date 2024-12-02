import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Criação da raiz do React
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

const root = ReactDOM.createRoot(rootElement);

// Renderização do aplicativo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Medição de performance
reportWebVitals(console.log);
