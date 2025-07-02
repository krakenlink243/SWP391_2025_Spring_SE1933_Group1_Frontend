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
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler"; // Added by Loc Phan
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import VerifyEmail from "./pages/VerifyEmail"; // Added by Loc Phan
import ForgotPasswordRequest from "./pages/ForgotPassword/ForgotPasswordRequest"; // Added by Loc Phan
import RegisterDetails from "./pages/RegisterDetails";
import GameApprrovePage from "./pages/AdminDashboard/GameApprovePage";
import GameApproveDetails from "./pages/GameApproveDetails";
import Transaction from "./pages/TransactionPage/Transaction";
import TransactionDetail from "./pages/TransactionPage/TransactionDetail";
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
  // Added by Phan NT Son 18-06-2025
  const headerHeight = useRef(null);
  const navHeight = useRef(null);
  const footerHeight = useRef(null);

  const [calculatedHeight, setCalculatedHeight] = useState(0);

  const calMinimumHeight = () => {
    const windowHeight = window.innerHeight;
    const headerH = headerHeight.current
      ? headerHeight.current.offsetHeight
      : 0;
    const navH = navHeight.current ? navHeight.current.offsetHeight : 0;
    const footH = footerHeight.current ? footerHeight.current.offsetHeight : 0;
    console.log("headerH:", headerH, "navH:", navH, "footH:", footH);

    setCalculatedHeight(windowHeight - headerH - navH - footH);
  };
  // --!!

  // Renamed by Phan NT Son
  console.log("App component is rendering..."); // DEBUG: Kiểm tra xem component có render không
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    if (isTokenExpired()) {
      localStorage.clear();
    }

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      // Giả sử bạn có token
      if (token) {
        try {
          const userId = localStorage.getItem("userId");
          const response = await axios.get(
            `http://localhost:8080/user/profile/${userId}`
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Failed to fetch current user", error);
          // Xử lý lỗi, có thể đăng xuất người dùng
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

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
    "/notifications"
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


  return (
    <div className="app-wrapper">
      {" "}
      <div className={`app-container`}>
        <div className={`main-app-content`}>
          {/* START FROM HERE */}
          {/* Adjusted by Phan NT Son */}
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
            {/* hoangvq */}
            <Route path="/aprrovegame" element={<AprroveF />}></Route>
            <Route
              path="/aprrovegame/:gameId"
              element={<ApproveDetailsF />}
            ></Route>
            <Route path="/sendgame" element={<RequestAddGame />}></Route>
            {/* hoangvq */}
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
            {/*adjusted by Bathanh - 15/6/2025 2:03PM */}
            <Route
              path="/notifications"
              element={<NotifPage minimumHeight={calculatedHeight} />}
            />
            <Route path="/admin" element={<AdminDashboard tab={adminTab} />} />{" "}
            {/* Added by Phan NT Son */}
            {/* hoangvq */}
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
            {/* hoangvq */}
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
            {/* Added by TSHUY */}
            {/* Notmebro */}
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
