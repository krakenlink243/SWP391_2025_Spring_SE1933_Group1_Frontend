import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom"; // Import các component của router

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import MainContent from "./components/MainContent/MainContent";
import GameDetail from "./components/GameDetail/GameDetail";
import HomePage from "./components/HomePage/HomePage";
import SendGametoAdmin from "./pages/SendGametoAdmin";
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/GameApprovePage";
import Transaction from "./components/TransactionFolder/Transaction";
import Cart from "./components/CartFolder/Cart";
// import NotificationBox from "./components/NotificationBox";
import NotificationList from "./components/NotificationList";
import "./App.css";
function App() {
  return (
    <div className="app-container">
      {" "}
      <Header />
      <div className="page-content-constrained-wrapper">
        <Navbar />
        {/* <NotificationBox userId={2} /> */}
        <NotificationList />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/game/:gameId" element={<Detail />} />
          <Route path="/game" element={<List />}></Route>
          <Route path="/aprrovegame" element={<AprroveF />}></Route>
          <Route path="/sendgame" element={<RequestAddGame />}></Route>
          <Route path="/login" element={<LoginF />} />
          <Route path="/register" element={<RegisterF />} />
          <Route path="/register-details" element={<RegisterDetailsF />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
function AprroveF() {
  return <GameApprrovePage />;
}
function LoginF() {
  return <Login />;
}
function RegisterF() {
  return <RegisterEmail />;
}
function RegisterDetailsF() {
  return <RegisterDetails />;
}
function RequestAddGame() {
  return (
    <div>
      <SendGametoAdmin />
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
