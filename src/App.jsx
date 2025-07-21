import { React, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import './App.css';
// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ChatLayout from "./layouts/ChatLayout";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import GameDetail from "./pages/GameDetail/GameDetail";
import GamesPage from "./components/GamesPage/GamesPage";
import Cart from "./pages/CartPage/Cart";
import WalletPage from "./pages/WalletPage/WalletPage";
import PaymentResultPage from "./components/Payment/PaymentResultPage";
import { Contact } from "./pages/PolicyPage/Contact";
import { PrivacyPolicy } from "./pages/PolicyPage/PrivacyPolicy";
import { TermsOfUse } from "./pages/PolicyPage/TermsOfUse";
import GameManagement from "./pages/Publisher/GameManagement/GameManagement";
import UpdateGame from "./pages/UpdateGame";

// Profile & User Pages
import Transaction from "./pages/TransactionPage/Transaction";
import FriendsPage from "./pages/Friend/FriendsPage";
import Library from "./pages/LibraryPage/Library";
import NotificationList from "./pages/NotificationPage/NotificationList";
import ProfilePage from "./components/Profile/ProfilePage";
import TransactionDetail from "./pages/TransactionPage/TransactionDetail";
import EditProfilePage from "./components/Profile/EditProfilePage";
import AvatarSettings from "./components/Profile/AvatarSettings/AvatarSettings";
import AccountDetailsPage from "./components/AccountDetail/AccountDetailsPage";
import EmailSettings from "./components/EmailChange/EmailSettings";
import ChangePassword from "./pages/ForgotPassword/ChangePassword";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PublisherApproveDetails from "./pages/Admin/Request/PublisherApproveDetails";
import FeedbackApproveDetails from "./pages/Admin/Request/FeedbackApproveDetails";
import GameApproveDetails from "./pages/Admin/Request/GameApproveDetails";
import FeedbackHub from "./pages/FeedbackHub";
import UserManagement from "./pages/Admin/UserManagement/UserManagementPage";

// Community
import ChatPage from "./pages/ChatPage/ChatPage";

// Auth
import Login from "./pages/Login";
import RegisterEmail from "./pages/RegisterEmail";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPasswordRequest from "./pages/ForgotPassword/ForgotPasswordRequest";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";
import RegisterDetails from "./pages/RegisterDetails";

// Others
import SendGameToAdmin from "./pages/SendGameToAdmin";
import SendUserFeedback from "./pages/SendUserFeedback";
import ApplyToPublisher from "./pages/ApplyToPublisher";
import ProfileLayout from "./layouts/ProfileLayout";
import UserFeedback from "./pages/UserFeedback";
import LegalPopup from "./components/Popup/LegalPopup";

import { isTokenExpired } from "./utils/validators";
import RequestSection from "./pages/Admin/Request/RequestSection";
import ErrorPage from "./pages/ErrorPage";

import Community from "./pages/CommunityPage/Community";
import ThreadDetailPage from "./pages/CommunityPage/ThreadDetailPage";
import CreateThreadModal from "./components/Community/CreateThreadModal";
import ReviewCard from "./components/Community/ReviewCard";
import ThreadCard from "./components/Community/ThreadCard";
import CommentSection from "./components/Community/CommentSection";
function AppRoutes() {
  // console.log("App component is rendering...");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    if (isTokenExpired()) {
      localStorage.clear();
    }

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token && !isTokenExpired()) {
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


  return (
    <div className={`app-container`}>
      <div className={`main-app-content`}>
        <LegalPopup />

        <Routes>

          {/* 404 - Error page */}
          <Route path="*" element={<ErrorPage />} />

          {/* Main user area */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<List />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account/wallet" element={<Wallet />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />

            {/* fallback */}
          </Route>

          {/* Chat (full-screen) */}
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<ChatPage />} />
          </Route>

          {/* User Profile and related Pages */}
          <Route element={<ProfileLayout />}>
            <Route path="/profile/friends" element={<FriendsPageContainer />} />
            <Route path="/sendfeedback" element={<SendUserFeedback />} />
            <Route path="/publisher/game-management/:tab?" element={<GameManagement />} />
            <Route path="/account/history" element={<Transaction />} />
            <Route path="/apply-publisher" element={<ApplyToPublisher />} />
            <Route path="/notifications" element={<NotifPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/sendgame" element={<RequestAddGame />} />
            <Route path="/profile/:userId/edit/avatar" element={<AvatarSettings />} />
            <Route path="/account" element={<AccountDetailsPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/change-email" element={<EmailSettings currentUser={currentUser} />} />
            <Route path="/profile/:userId/edit/info" element={<EditProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/sendpublisher" element={<SendPublisher publiserId={localStorage.getItem("userId")} />} />
            <Route path="feedbackhub" element={<FeedbackHub />}></Route>
            <Route path="feedbackhub/:feedbackId" element={<UserFeedbackDetails />} />
            <Route path="/account/history/detail/:transactionId" element={<TransactionDetail />} />
            <Route path="/register" element={<RegisterF />} />
            <Route path="/register-details" element={<RegisterDetailsF />} />
            <Route path="/login" element={<LoginF />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/oauth2/callback" element={<OAuth2RedirectHandler />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/update-game/:gameId" element={<UpdateGame />} />
            <Route path="/edit-game/:requestId" element={<UpdateGame />} />
            <Route path="publisher/game/detail/:requestId" element={<GameApproveDetails />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/threads/:threadId" element={<ThreadDetailPage />} />
          </Route>

          {/* Admin area */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="request/:tab?" element={<RequestSection />} />
            <Route path="request/publisher/detail/:requestId" element={<PublisherApproveDetails />} />
            <Route path="request/feedback/detail/:requestId" element={<FeedbackApproveDetails />} />
            <Route path="request/game/detail/:requestId" element={<GameApproveDetails />} />
            <Route path="user-management/:tab?" element={<UserManagement />} />
          </Route>

        </Routes>

      </div>
    </div>
  );
}

function SendPublisher() {
  return <ApplyToPublisher publisherId={localStorage.getItem("userId")} />;
}

function UserFeedbackDetails() {
  return <UserFeedback />;
}

function LoginF() {
  return (
    <div className="container-fluid py-3"
      style={{
        background: "radial-gradient(rgba(24, 26, 33, 0) 0%, #181A21 100%) fixed no-repeat, url(https://cdnphoto.dantri.com.vn/4ydXR7ZhWF5ViH60xAFvBolm3JQ=/2021/02/01/khu-cach-ly-dai-hoc-fpt-13-1612154602281.jpg) center center no-repeat, #181A21"
      }}

    >
      <div className="row">
        <div className="spacer col-lg-4"></div>
        <div className="col-lg-4">
          <Login />
        </div>
        <div className="spacer col-lg-4"></div>
      </div>
    </div>
  );
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

function NotifPage() {
  return (
    <div
      className="container-fluid h-100"
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
 * @since 23-06-2025
 * @returns
 */
function FriendsPageContainer() {
  return (
    <div
      className="container-fluid h-100"
      style={{
        background:
          "url(https://community.fastly.steamstatic.com/public/images/friends/colored_body_top2.png?v=2) center top no-repeat #1b2838",
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
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}