import React from "react";
import { BrowserRouter, Router, Routes, Route, Outlet, Link } from "react-router-dom"; // Import các component của router
import RegisterEmail from './pages/RegisterEmail';
import RegisterDetails from './pages/RegisterDetails';
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import MainContent from "./components/MainContent/MainContent";
import GameDetail from "./components/GameDetail/GameDetail";
import HomePage from "./components/HomePage/HomePage";
import Login from "./pages/Login";
import "./App.css";
import GameCard from "./components/GameCard/GameCard";
function App() {
  return (
    <div className="app-container">
      {" "}
      <Header />
      <div className="page-content-constrained-wrapper">
        <Navbar />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterEmail />} />
          <Route path="/register-details" element={<RegisterDetails />} />
          <Route path="/" element={<Home />}></Route>
          <Route path="/game/:gameId" element={<Detail />} />
          <Route path="/game" element={<List />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
function List() {
  return (
    <div className="app-container">
      {" "}
      <div className="page-content-constrained-wrapper">
        <MainContent />
      </div>
    </div>
  );
}
function Detail() {
  return (
    <div className="app-container">
      {" "}
      <div className="page-content-constrained-wrapper">
        <GameDetail />
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="app-container">
      <div className="page-content-constrained-wrapper">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Go back to Home</Link>
      </div>
    </div>
  );
}
function Home() {
  return (
    <div className="app-container">
      <div className="page-content-constrained-wrapper">
        <HomePage />
      </div>
    </div>
  );
}



export default App;
