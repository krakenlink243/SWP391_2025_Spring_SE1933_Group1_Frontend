import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import GameDetail from "./pages/GameDetail/GameDetail";
import HomePage from "./pages/HomePage/HomePage";
import SendGameToAdmin from "./pages/SendGameToAdmin";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler"; // Added by Loc Phan
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPasswordRequest from "./pages/ForgotPassword/ForgotPasswordRequest";
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/AdminDashboard/GameApprovePage";
import GameApproveDetails from "./pages/GameApproveDetails";
import Transaction from "./pages/TransactionPage/Transaction";
import TransactionDetail from "./pages/TransactionPage/TransactionDetail";
import Cart from "./pages/CartPage/Cart";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import NotificationList from "./pages/NotificationPage/NotificationList";
import GamesPage from "./components/GamesPage/GamesPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
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
import ChatPage from "./pages/Community/ChatPage";
import ChatHeader from "./pages/Community/ChatHeader";
import AccountDetailsPage from "./components/AccountDetail/AccountDetailsPage";
import PaymentResultPage from "./components/Payment/PaymentResultPage";
import FriendsPage from "./pages/Friend/FriendsPage";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import { OnlineUserProvider } from "./utils/OnlineUsersContext";

import FeedbackApprovePage from "./pages/FeedbackApprovePage";
import FeedbackApproveDetails from "./pages/FeedbackApproveDetails";
import FeedbackHub from "./pages/FeedbackHub";
import UserFeedback from "./pages/UserFeedback";
import EmailSettings from "./components/EmailChange/EmailSettings";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "./utils/validators";
import { CartCountProvider } from "./utils/TotalInCartContext";
import AIGeneratorFrontend from "./pages/test"; // TEST

function AppRoutes() {
  const headerHeight = useRef(null);
  const navHeight = useRef(null);
  const footerHeight = useRef(null);

  const [calculatedHeight, setCalculatedHeight] = useState(0);

  const calMinimumHeight = () => {
    const windowHeight = window.innerHeight;
    const headerH = headerHeight.current ? headerHeight.current.offsetHeight : 0;
    const navH = navHeight.current ? navHeight.current.offsetHeight : 0;
    const footH = footerHeight.current ? footerHeight.current.offsetHeight : 0;
    console.log("headerH:", headerH, "navH:", navH, "footH:", footH);

    setCalculatedHeight(windowHeight - headerH - navH - footH);
  };

  console.log("App component is rendering...");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    if (isTokenExpired()) {
      localStorage.clear();
    }

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userId = localStorage.getItem("userId");
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/profile/${userId}`
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Failed to fetch current user", error);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const location = useLocation();
  const currentPath = location.pathname;
  const needlessNavPath = [
    "/profile",
    "/chat",
    "/admin",
    "/sendfeedback",
    "/wallet",
    "/login",
    "/register",
    "/library",
    "/notifications",
  ];
  const needlessHeaderPath = ["/admin", "/chat"];
  const needlessFooterPath = ["/admin", "/chat"];
  const isAddminPath = currentPath.startsWith("/admin");

  const [adminTab, setAdminTab] = useState("Request Management");
  const handleAdminTabChange = (tab) => {
    setAdminTab(tab);
  };

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

  //--!!

  const expDate = localStorage.getItem("expDate");
  const checkToken = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expDate === null || expDate < currentTime) {
      localStorage.clear();
      return <Navigate to="/" replace />;
    }
  };

  // Thêm Google Translate Element
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="app-wrapper">
      <div className={`app-container`}>
        <div className={`main-app-content`}>
          {isAddminPath && (
            <AdminHeader
              currentTab={adminTab}
              changeToTab={handleAdminTabChange}
              ref={headerHeight}
            />
          )}
          {!isNeedlessHeader && <Header ref={headerHeight} />}

          {!isNeedlessNav && (
            <CartCountProvider>
              <Navbar ref={navHeight} />
            </CartCountProvider>
          )}
          {/* --!! */}

          {/* Remove BrowserRouter by Phan NT Son */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/game/:gameId" element={<Detail />} />
            <Route path="/game" element={<List />}></Route>
            <Route path="/aprrovegame" element={<AprroveF />}></Route>
            <Route
              path="/aprrovegame/:gameId"
              element={<ApproveDetailsF />}
            ></Route>
            <Route path="/sendgame" element={<RequestAddGame />}></Route>
            <Route path="/login" element={<LoginF />} />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordRequest />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/oauth2/callback"
              element={<OAuth2RedirectHandler />}
            />{" "}
            {/* Added by Loc Phan */}
            <Route path="/register" element={<RegisterF />} />
            <Route path="/verify-email" element={<VerifyEmail />} />{" "}
            {/* Added by Loc Phan */}
            <Route path="/register-details" element={<RegisterDetailsF />} />
            <Route path="/account/history" element={<Transaction />} />
            <Route
              path="/account/history/detail/:transactionId"
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
            <Route
              path="/sendpublisher"
              element={
                <SendPublisher publiserId={localStorage.getItem("userId")} />
              }
            ></Route>
            <Route
              path="/approvepublisher"
              element={<ApprovePublisher />}
            ></Route>
            <Route
              path="/approvepublisher/:publisherId"
              element={<ApprovePublisherDetails />}
            ></Route>
            <Route path="/sendfeedback" element={<SendFeedback />}></Route>
            <Route
              path="/approvefeedback"
              element={<ApproveFeedback />}
            ></Route>
            <Route
              path="/approvefeedback/:feedbackId"
              element={<ApproveFeedbackDetails />}
            ></Route>
            <Route
              path="/feedbackhub/:feedbackId"
              element={<UserFeedbackDetails />}
            ></Route>
            <Route path="/feedbackhub" element={<FeeedbackHub />}></Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            {/* Added by TSHUY */}
            {/* TSHUY */}
            <Route
              path="/profile/:userId/edit/info"
              element={<EditProfilePage />}
            />
            <Route
              path="/profile/:userId/edit/avatar"
              element={<AvatarSettings />}
            />
            <Route path="/account/wallet" element={<Wallet />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/account" element={<AccountDetailsPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route
              path="/profile/friends"
              element={<Friends minimumHeight={calculatedHeight} />}
            />
            <Route
              path="/change-email"
              element={<EmailSettings currentUser={currentUser} />}
            />
          </Routes>
          {/* Thêm phần tử cho Google Translate Widget */}
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
  return <div><SendGameToAdmin /></div>;
}
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
function Chat() {
  return <div><ChatPage /></div>;
}
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