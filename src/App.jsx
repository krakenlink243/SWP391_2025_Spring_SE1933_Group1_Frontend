import React from "react";
// Son Added useLocation
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom"; // Import các component của router
import { useState, useEffect, loadingState, useRef, useMemo } from "react"; // Import useState và useEffect từ React
import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP
import "./App.css";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import GameDetail from "./pages/GameDetail/GameDetail";
import HomePage from "./pages/HomePage/HomePage";
import SendGameToAdmin from "./pages/SendGameToAdmin";
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/AdminDashboard/GameApprovePage";
import GameApproveDetails from "./pages/GameApproveDetails";
import Transaction from "./pages/TransactionPage/Transaction";
import TransactionDetail from "./pages/TransactionPage/TransactionDetail"; // added by Bathanh
import Cart from "./pages/CartPage/Cart";
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
import EditProfilePage from "./components/Profile/EditProfilePage";
import SendUserFeedback from "./pages/SendUserFeedback";
import Library from "./pages/LibraryPage/Library";
import WalletPage from "./pages/WalletPage/WalletPage";
import AvatarSettings from "./components/Profile/AvatarSettings/AvatarSettings";
import ChatPage from "./pages/Community/ChatPage"; // Added by Phan NT Son
import ChatHeader from "./pages/Community/ChatHeader"; // Added by Phan NT Son
import AccountDetailsPage from "./components/AccountDetail/AccountDetailsPage"; // Added by TSHuy
import PaymentResultPage from "./components/Payment/PaymentResultPage"; // Added by TSHuy
import FriendsPage from "./pages/Friend/FriendsPage"; // Added by Phan NT Son
import { OnlineUserProvider } from "./utils/OnlineUsersContext";

import FeedbackApprovePage from "./pages/FeedbackApprovePage";
import FeedbackApproveDetails from "./pages/FeedbackApproveDetails";
import FeedbackHub from "./pages/FeedbackHub";
import UserFeedback from "./pages/UserFeedback";
function AppRoutes() {
  const headerHeight = useRef(null);
  const navHeight = useRef(null);
  const footerHeight = useRef(null);

  const [calculatedHeight, setCalculatedHeight] = useState(0);
  const [splashStage, setSplashStage] = useState("pending");
  const audioRef = useRef(null);

  const calMinimumHeight = () => {
    const windowHeight = window.innerHeight;
    const headerH = headerHeight.current
      ? headerHeight.current.offsetHeight
      : 0;
    const navH = navHeight.current ? navHeight.current.offsetHeight : 0;
    const footH = footerHeight.current ? footerHeight.current.offsetHeight : 0;
    setCalculatedHeight(windowHeight - headerH - navH - footH);
  };

  useEffect(() => {
    checkToken();
    calMinimumHeight();

    const lastVisit = localStorage.getItem("lastVisitDate");
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (lastVisit === today) {
      setSplashStage("finished");
    } else {
      setSplashStage("active");
      audioRef.current = new Audio("/sounds/boot_sound.mp3");
      audioRef.current.load();

      const playAudioOnInteraction = () => {
        audioRef.current
          ?.play()
          .catch((err) => console.error("Audio play failed:", err));
        window.removeEventListener("click", playAudioOnInteraction);
        window.removeEventListener("keydown", playAudioOnInteraction);
      };

      window.addEventListener("click", playAudioOnInteraction);
      window.addEventListener("keydown", playAudioOnInteraction);

      const exitTimer = setTimeout(() => {
        setSplashStage("exiting");
      }, 6000);

      const finishTimer = setTimeout(() => {
        setSplashStage("finished");
        localStorage.setItem("lastVisitDate", today);
      }, 7000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
        window.removeEventListener("click", playAudioOnInteraction);
        window.removeEventListener("keydown", playAudioOnInteraction);
      };
    }
  }, []);

  const shouldRenderSplash =
    splashStage === "active" || splashStage === "exiting";
  const isSplashExiting = splashStage === "exiting";
  const hideHeaderLogo = shouldRenderSplash;

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const location = useLocation();
  const currentPath = location.pathname;
  const needlessNavPath = ["/profile", "/chat", "/admin", "/sendfeedback", "/wallet", "/cart", "/login", "/register"];
  const needlessHeaderPath = ["/admin", "/chat"];
  const needlessFooterPath = ["/admin", "/chat"];
  const isAddminPath = currentPath.startsWith("/admin");

  const [adminTab, setAdminTab] = useState("Request Management");

  const isNeedlessHeader = useMemo(
    () => needlessHeaderPath.some((p) => currentPath.startsWith(p)),
    [currentPath]
  );
  const isNeedlessNav = useMemo(
    () => needlessNavPath.some((p) => currentPath.startsWith(p)),
    [currentPath]
  );
  const isNeedlessFooter = useMemo(
    () => needlessFooterPath.some((p) => currentPath.startsWith(p)),
    [currentPath]
  );

  const expDate = localStorage.getItem("expDate");
  const checkToken = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expDate === null || expDate < currentTime) {
      localStorage.clear();
      return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {shouldRenderSplash && <SplashScreen isExiting={isSplashExiting} />}
        <div
          className={`main-app-content ${
            splashStage !== "finished" ? "hidden" : ""
          }`}
        >
          {isAddminPath && (
            <AdminHeader
              currentTab={adminTab}
              changeToTab={setAdminTab}
              ref={headerHeight}
            />
          )}
          {!isNeedlessHeader && (
            <Header hideLogo={hideHeaderLogo} ref={headerHeight} />
          )}
          {!isNeedlessNav && <Navbar ref={navHeight} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameId" element={<Detail />} />
            <Route path="/game" element={<List />} />
            <Route path="/aprrovegame" element={<AprroveF />} />
            <Route path="/aprrovegame/:gameId" element={<ApproveDetailsF />} />
            <Route path="/sendgame" element={<RequestAddGame />} />
            <Route path="/login" element={<LoginF />} />
            <Route path="/register" element={<RegisterF />} />
            <Route path="/register-details" element={<RegisterDetailsF />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route
              path="/transaction/detail/:transactionId"
              element={<TransactionDetail />}
            />
            <Route
              path="/cart"
              element={<Cart minHeight={calculatedHeight} />}
            />
            <Route path="/library" element={<Library />} />
            <Route
              path="/notifications"
              element={<NotifPage minimumHeight={calculatedHeight} />}
            />
            <Route path="/admin" element={<AdminDashboard tab={adminTab} />} />
            <Route path="/sendpublisher" element={<SendPublisher />} />
            <Route path="/approvepublisher" element={<ApprovePublisher />} />
            <Route
              path="/approvepublisher/:publisherId"
              element={<ApprovePublisherDetails />}
            />
            <Route path="/sendfeedback" element={<SendFeedback />} />
            <Route path="/approvefeedback" element={<ApproveFeedback />} />
            <Route
              path="/approvefeedback/:feedbackId"
              element={<ApproveFeedbackDetails />}
            />
            <Route
              path="/feedbackhub/:feedbackId"
              element={<UserFeedbackDetails />}
            />
            <Route path="/feedbackhub" element={<FeeedbackHub />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/profile/:userId/edit/info"
              element={<EditProfilePage />}
            />
            <Route
              path="/profile/:userId/edit/avatar"
              element={<AvatarSettings />}
            />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/account" element={<AccountDetailsPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route
              path="/profile/friends"
              element={<Friends minimumHeight={calculatedHeight} />}
            />
          </Routes>
        </div>
        {!isNeedlessFooter && <Footer ref={footerHeight} />}
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
  return <ApplyToPublisher publisherId={localStorage.getItem("userId")} />;
}
function ApprovePublisher() {
  return <PublisherApprovePage />;
}
function ApprovePublisherDetails() {
  return <PublisherApproveDetails />;
}
function SendFeedback() {
  return <SendUserFeedback />;
}
function ApproveFeedback() {
  return <FeedbackApprovePage />;
}
function ApproveFeedbackDetails() {
  return <FeedbackApproveDetails />;
}
function UserFeedbackDetails() {
  return <UserFeedback />;
}
function FeeedbackHub() {
  return <FeedbackHub />;
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
      <SendGameToAdmin />
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
    <div
      className="container-fluid"
      style={{ minHeight: `${minimumHeight}px` }}
    >
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <NotificationList />
      </div>
    </div>
  );
}

/**
 * @author Phan NT Son
 * @since 22-06-2025
 * @returns
 */
function Chat() {
  return (
    <div>
      <ChatPage />
    </div>
  );
}

/**
 * @author Phan NT Son
 * @since 23-06-2025
 * @returns
 */
function Friends({ minimumHeight }) {
  return (
    <div
      className="container-fluid"
      style={{
        background:
          "url(https://community.fastly.steamstatic.com/public/images/friends/colored_body_top2.png?v=2) center top no-repeat #1b2838",
        minHeight: `${minimumHeight}px`,
      }}
    >
      <div className="row">
        <div className="spacer col-lg-1"></div>
        <div className="col-lg-10">
          <FriendsPage />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OnlineUserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </OnlineUserProvider>
  );
}
