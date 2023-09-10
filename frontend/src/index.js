import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { positions, transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'
import { AuthProvider } from './context/Auth'
import { SearchProvider } from './context/Search'
import { CartProvider } from './context/Cart'

const root = ReactDOM.createRoot(document.getElementById('root'));
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}

root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);