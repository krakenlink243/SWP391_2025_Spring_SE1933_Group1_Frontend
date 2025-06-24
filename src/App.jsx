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
import FriendsPage from "./pages/Friend/FriendsPage"; // Added by Phan NT Son

function AppRoutes() {
  // Added by Phan NT Son 18-06-2025
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
  // --!!

  // Renamed by Phan NT Son
  console.log("App component is rendering..."); // DEBUG: Kiểm tra xem component có render không

  // --- LOGIC CHO SPLASH SCREEN  ---

  // Sử dụng một state duy nhất để quản lý các giai đoạn của splash screen
  // 'pending': Trạng thái chờ, chưa biết là người dùng cũ hay mới
  // 'active': Là người dùng mới, đang hiển thị splash screen
  // 'exiting': Đang trong quá trình mờ dần để thoát
  // 'finished': Đã kết thúc, hiển thị ứng dụng chính
  const [splashStage, setSplashStage] = useState("pending");
  const audioRef = useRef(null); // Giữ tham chiếu đến đối tượng Audio

  useEffect(() => {
    checkToken(); // Kiểm tra token khi component mount
    calMinimumHeight(); // Tính toán chiều cao tối thiểu khi component mount

    // Effect này chỉ chạy một lần duy nhất khi component được mount
    // vì mảng phụ thuộc là rỗng [].
    console.log("hasVisited check running...", localStorage.getItem("hasVisited"));
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      console.log("Returning user. Skipping splash screen.");
      setSplashStage("finished");
    } else {
      // Nếu là người dùng mới, kích hoạt splash screen
      console.log("First visit detected. Activating splash screen.");
      setSplashStage("active");

      // --- Xử lý âm thanh ---
      audioRef.current = new Audio("/sounds/boot_sound.mp3");
      audioRef.current.load();

      const playAudioOnInteraction = () => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .catch((err) => console.error("Audio play failed:", err));
        }
        // Gỡ bỏ listener sau lần tương tác đầu tiên để tránh phát lại
        window.removeEventListener("click", playAudioOnInteraction);
        window.removeEventListener("keydown", playAudioOnInteraction);
      };

      // Thêm trình lắng nghe sự kiện
      window.addEventListener("click", playAudioOnInteraction);
      window.addEventListener("keydown", playAudioOnInteraction);

      // --- Xử lý Timers ---
      // Timer 1: Sau 6 giây, bắt đầu quá trình thoát (fade out)
      const exitTimer = setTimeout(() => {
        console.log("Main splash duration finished. Starting transition.");
        setSplashStage("exiting");
      }, 6000); // 6 giây

      // Timer 2: Sau 7 giây (6s + 1s fade out), kết thúc hoàn toàn
      const finishTimer = setTimeout(() => {
        console.log("Transition finished. Hiding splash screen.");
        setSplashStage("finished");
        localStorage.setItem("hasVisited", "true");
      }, 7000); // 7 giây

      // --- Hàm dọn dẹp (Cleanup Function) ---
      // Hàm này sẽ được gọi khi component bị unmount (ví dụ: chuyển trang)
      // để tránh rò rỉ bộ nhớ.
      return () => {
        console.log("Cleaning up splash screen effects.");
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
        window.removeEventListener("click", playAudioOnInteraction);
        window.removeEventListener("keydown", playAudioOnInteraction);
      };
    }
  }, []); // <-- MẢNG RỖNG RẤT QUAN TRỌNG!

  // Các biến được suy ra từ state, giúp code ở phần JSX dễ đọc hơn
  const shouldRenderSplash =
    splashStage === "active" || splashStage === "exiting";
  const isSplashExiting = splashStage === "exiting";
  const hideHeaderLogo = shouldRenderSplash;
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
  const currentPath = location.pathname;
  const needlessNavPath = ["/profile", "/chat", "/admin", "/sendfeedback","/wallet","/cart"];
  const needlessHeaderPath = ["/admin", "/chat"];
  const needlessFooterPath = ["/admin", "/chat"];
  const isAddminPath = currentPath.startsWith("/admin")

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

  /**
   * @author Phan NT Son
   * @since 18-06-2025
   */
  const expDate = localStorage.getItem("expDate");
  const checkToken = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expDate === null || expDate < currentTime) {
      localStorage.clear();
      return <Navigate to={"/"} replace />
    }
  };


  return (
    <div className="app-wrapper">
      {" "}
      <div className={`app-container`}>
        {shouldRenderSplash && <SplashScreen isExiting={isSplashExiting} />}
        <div
          className={`main-app-content ${splashStage !== "finished" ? "hidden" : ""
            }`}
        >
          {/* START FROM HERE */}
          {/* Adjusted by Phan NT Son */}
          {isAddminPath && <AdminHeader
            currentTab={adminTab}
            changeToTab={handleAdminTabChange}
            ref={headerHeight}
          />}
          {!isNeedlessHeader && <Header hideLogo={hideHeaderLogo} ref={headerHeight} />}

          {!isNeedlessNav && <Navbar ref={navHeight} />}
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
            <Route path="/cart" element={<Cart minHeight={calculatedHeight} />} />
            <Route path="/library" element={<Library />} />
            {/*adjusted by Bathanh - 15/6/2025 2:03PM */}
            <Route path="/notifications" element={<NotifPage minimumHeight={calculatedHeight} />} />
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
            <Route path="/sendfeedback" element={<SendFeedback />}></Route>
            {/* hoangvq */}
            <Route path="/profile" element={<ProfilePage />} />
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
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile/friends" element={<Friends minimumHeight={calculatedHeight} />} />
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
  return <ApplyToPublisher />;
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
    <div className="container-fluid" style={{ background: "url(https://community.fastly.steamstatic.com/public/images/friends/colored_body_top2.png?v=2) center top no-repeat #1b2838", minHeight: `${minimumHeight}px` }}>
      <div className="row">
        <div className="spacer col-lg-1"></div>
        <div className="col-lg-10">
          <FriendsPage />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
