import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SendGameToAdmin from './pages/SendGameToAdmin'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterEmail from './pages/RegisterEmail';
import RegisterDetails from './pages/RegisterDetails';
function showMyName() {
  alert("My name is Hoang Vu")
}
function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/register" element={<RegisterEmail />} />
        <Route path="/register-details" element={<RegisterDetails />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
