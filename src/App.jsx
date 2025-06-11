import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom"; // Import các component của router
import { useState, useEffect } from "react"; // Import useState và useEffect từ React
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import GameDetail from "./components/GameDetail/GameDetail";
import HomePage from "./components/HomePage/HomePage";
import SendGametoAdmin from "./pages/SendGametoAdmin";
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/GameApprovePage";
import Transaction from "./components/TransactionFolder/Transaction";
import Cart from "./components/CartFolder/Cart";
import SplashScreen from "./components/SplashScreen/SplashScreen"; // Import SplashScreen component
import "./App.css";
import GamesPage from "./components/GamesPage/GamesPage";
function App() {
  console.log("App component is rendering..."); // DEBUG: Kiểm tra xem component có render không

  // --- LOGIC CHO SPLASH SCREEN ---
  const [loadingState, setLoadingState] = useState({
    isFirstVisit: false,
    isExiting: false,
    isFinished: false,
  });

  useEffect(() => {
    console.log("useEffect is running..."); // DEBUG: Kiểm tra xem effect có chạy không
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      console.log("First visit detected. Starting splash screen timer.");
      setLoadingState((prevState) => ({ ...prevState, isFirstVisit: true }));

      const transitionTimer = setTimeout(() => {
        console.log("5s timer finished. Starting transition.");
        setLoadingState((prevState) => ({ ...prevState, isExiting: true }));
      }, 5000); // 5 giây

      const finishTimer = setTimeout(() => {
        console.log("Transition finished. Hiding splash screen.");
        setLoadingState((prevState) => ({ ...prevState, isFinished: true }));
        localStorage.setItem("hasVisited", "true");
      }, 6500); // 5s + 1.5s

      return () => {
        clearTimeout(transitionTimer);
        clearTimeout(finishTimer);
      };
    } else {
      console.log("Returning user. Skipping splash screen.");
      setLoadingState({
        isFirstVisit: false,
        isExiting: false,
        isFinished: true,
      });
    }
  }, []);

  const shouldRenderSplash =
    loadingState.isFirstVisit && !loadingState.isFinished;
  const hideHeaderLogo = loadingState.isFirstVisit && !loadingState.isFinished;
  // --- KẾT THÚC LOGIC SPLASH SCREEN ---

  return (
    <div className="app-container">
      {/* 1. Render SplashScreen nếu cần */}
      {shouldRenderSplash && (
        <SplashScreen isExiting={loadingState.isExiting} />
      )}

      <div
        className={`main-app-content ${
          !loadingState.isFinished ? "hidden" : ""
        }`}
      >
        <BrowserRouter>
          <Header hideLogo={hideHeaderLogo} />
          <Navbar />  
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
        <GamesPage />
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
