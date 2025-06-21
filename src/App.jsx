import React from "react";
// Son Added useLocation
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom"; // Import các component của router
import { useState, useEffect, useRef } from "react"; // Import useState và useEffect từ React
import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP
import "./App.css";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import GameDetail from "./pages/GameDetail/GameDetail";
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
import NotificationList from "./pages/NotificationPage/NotificationList";
import GamesPage from "./components/GamesPage/GamesPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"; // Added by Phan NT Son
import ApplyToPublisher from "./pages/ApplyToPublisher";
import PublisherApprovePage from "./pages/PublisherApprovePage";
import PublisherApproveDetails from "./pages/PublisherApproveDetails";
import AdminHeader from "./pages/AdminDashboard/AdminHeader";
import Footer from "./components/Footer/Footer";
import ProfilePage from "./components/Profile/ProfilePage";
import Library from "./components/LibraryFolder/Library";
import WalletPage from "./pages/WalletPage/WalletPage";



function AppRoutes() {

  // Added by Phan NT Son 18-06-2025
  const headerHeight = useRef(null);
  const navHeight = useRef(null);
  const footerHeight = useRef(null);
  const [calculatedHeight, setCalculatedHeight] = useState(0);

  const calMinimumHeight = () => {
    if (headerHeight.current && navHeight.current) {
      const windowHeight = window.screen.availHeight;
      const headerH = headerHeight.current.offsetHeight;
      const navH = navHeight.current.offsetHeight;
      const footH = footerHeight.current.offsetHeight;

      console.log(windowHeight);
      console.log(headerH);
      console.log(navH);
      console.log(footH);
      setCalculatedHeight(windowHeight - headerH - navH - footH);
    }
  }
  // --!!


  // Renamed by Phan NT Son
  console.log("App component is rendering..."); // DEBUG: Kiểm tra xem component có render không

  // --- LOGIC CHO SPLASH SCREEN ---
  const [loadingState, setLoadingState] = useState({
    isFirstVisit: false,
    isExiting: false,
    isFinished: false,
  });

  useEffect(() => {
    calMinimumHeight();

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

    checkToken();
  }, [loadingState.isFinished]);

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
  const isProfilePage = location.pathname.startsWith("/profile");
  const [adminTab, setAdminTab] = useState("Request Management");
  const handleAdminTabChange = (tab) => {
    setAdminTab(tab);
  };
  //--!!

  /**
   * @author Phan NT Son
   * @since 18-06-2025
   */
  const expDate = localStorage.getItem("expDate");
  const checkToken = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expDate === null || expDate < currentTime) {
      localStorage.clear();
    }
  }

  return (
    <div className={`app-container${isProfilePage ? " transparent" : ""}`}>
      {" "}
      <div className="app-container">
        {shouldRenderSplash && (
          <SplashScreen isExiting={loadingState.isExiting} />
        )}
        <div
          className={`main-app-content ${
            !loadingState.isFinished ? "hidden" : ""
          }`}
        >
          {/* Adjusted by Phan NT Son */}
          {isAdminRoute ? (
            <AdminHeader
              currentTab={adminTab}
              changeToTab={handleAdminTabChange}
            />
          ) : (
            <Header hideLogo={hideHeaderLogo} />
          )}
          {!isAdminRoute && <Navbar />}
          {/* --!! */}

          {/* Remove BrowserRouter by Phan NT Son */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/game/:gameId" element={<Detail />} />
            <Route path="/game" element={<List />}></Route>
            {/* hoangvq */}
            <Route path="/aprrovegame" element={<AprroveF />}></Route>
            <Route
              path="/aprrovegame/:gameId"
              element={<ApproveDetailsF />}
            ></Route>
            <Route path="/sendgame" element={<RequestAddGame />}></Route>
            {/* hoangvq */}
            <Route path="/login" element={<LoginF />} />
            <Route path="/register" element={<RegisterF />} />
            <Route path="/register-details" element={<RegisterDetailsF />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/library" element={<Library />} />
            {/*adjusted by Bathanh - 15/6/2025 2:03PM */}
            <Route path="/notifications" element={<NotificationList />} />
            <Route
              path="/admin"
              element={<AdminDashboard tab={adminTab} />}
            />{" "}
            {/* Added by Phan NT Son */}
            {/* hoangvq */}
            <Route path="/sendpublisher" element={<SendPublisher />}></Route>
            <Route
              path="/approvepublisher"
              element={<ApprovePublisher />}
            ></Route>
            <Route
              path="/approvepublisher/:publisherId"
              element={<ApprovePublisherDetails />}
            ></Route>
            {/* hoangvq */}
            <Route path="/profile" element={<ProfilePage />} />
            {/* Added by TSHUY */}
            {/* TSHUY */}
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </div>
        <Footer /> {/* Added by TSHUY */}
      </div>
    </div>
  );
}
function AprroveF() {
  return <GameApprrovePage />;
}
function ApproveDetailsF() {
  return <GameApproveDetails />;
}
function SendPublisher() {
  return <ApplyToPublisher />;
}
function ApprovePublisher() {
  return <PublisherApprovePage />;
}
function ApprovePublisherDetails() {
  return <PublisherApproveDetails />;
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
/**
 * Adjust by @author Phan NT Son
 * @since 17-06-2025
 * @returns
 */
function List() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <GamesPage />
        </div>
      </div>
    </div>
  );
}
/**
 * @author Phan NT Son
 * @since 15-06-2025
 * @returns
 */
function Detail() {
  return <GameDetail />;
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
  return <HomePage />;
}

function Wallet() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <WalletPage />
      </div>
    </div>
  );
}

function NotifPage({ minimumHeight }) {
  return (
    <div className="container-fluid" style={{ minHeight: `${minimumHeight}px` }}>
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <NotificationList />
      </div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
