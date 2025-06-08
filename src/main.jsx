import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Cart from './Cart.jsx';
import Transaction from './Transaction.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/cart" element={<Cart />} />
        <Route path="/transactions" element={<Transaction />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

