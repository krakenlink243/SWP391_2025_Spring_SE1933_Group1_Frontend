import React from "react";
// Son Added useLocation
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from "react-router-dom"; // Import các component của router
import { useState, useEffect } from "react"; // Import useState và useEffect từ React
import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP
import "./App.css";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import GameDetail from "./components/GameDetail/GameDetail";
import HomePage from "./pages/HomePage/HomePage";
import SendGametoAdmin from "./pages/SendGametoAdmin";
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/AdminDashboard/GameApprovePage";
import GameApproveDetails from "./pages/GameApproveDetails";
import Transaction from "./components/TransactionFolder/Transaction";
import Cart from "./components/CartFolder/Cart";
import SplashScreen from "./components/SplashScreen/SplashScreen"; // Import SplashScreen component
import NotificationList from "./pages/NotificationList";
import GamesPage from "./components/GamesPage/GamesPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"; // Added by Phan NT Son
import AdminHeader from "./pages/AdminDashboard/AdminHeader";
import Library from "./components/LibraryFolder/Library";


function AppRoutes() { // Renamed by Phan NT Son
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
      }, 2000); // 5 giây

      const finishTimer = setTimeout(() => {
        console.log("Transition finished. Hiding splash screen.");
        setLoadingState((prevState) => ({ ...prevState, isFinished: true }));
        localStorage.setItem("hasVisited", "true");
      }, 3000);

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

  // Added by Phan NT Son
  // Set up axios interceptor to include token in headers
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /**
   * @author Phan NT Son
   */
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [adminTab, setAdminTab] = useState("Request Management");
  const handleAdminTabChange = (tab) => {
    setAdminTab(tab);
  };
  //--!!

  return (
    <div className="app-container">
      {shouldRenderSplash && (
        <SplashScreen isExiting={loadingState.isExiting} />
      )}

      <div
        className={`main-app-content ${!loadingState.isFinished ? "hidden" : ""
          }`}
      >
        {/* Adjusted by Phan NT Son */}
        {isAdminRoute ?
          (<AdminHeader
            currentTab={adminTab}
            changeToTab={handleAdminTabChange}
          />) : (<Header hideLogo={hideHeaderLogo} />)}
        {!isAdminRoute && <Navbar />}
        {/* --!! */}

        {/* Remove BrowserRouter by Phan NT Son */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/game/:gameId" element={<Detail />} />
          <Route path="/game" element={<List />}></Route>
          {/* <Route path="/aprrovegame" element={<AprroveF />}></Route> */}
          <Route path="/admin/approvegame/:gameId" element={<ApproveDetailsF />}></Route> {/* Adjust by Phan NT Son */}
          <Route path="/sendgame" element={<RequestAddGame />}></Route>
          <Route path="/login" element={<LoginF />} />
          <Route path="/register" element={<RegisterF />} />
          <Route path="/register-details" element={<RegisterDetailsF />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/library" element={<Library />} />{/*adjusted by Bathanh - 15/6/2025 2:03PM */}
          <Route path="/notifications" element={<NotificationList />} />
          <Route path="/admin" element={<AdminDashboard tab={adminTab} />} /> {/* Added by Phan NT Son */}
        </Routes>
      </div>
    </div>
  );
}
function AprroveF() {
  return <GameApprrovePage />;
}
function ApproveDetailsF() {
  return <GameApproveDetails />
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
    <HomePage />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
