import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * @author Loc Phan
 */

/**
 * This component handles Google OAuth2 redirect.
 * It extracts token from the URL and stores it in localStorage,
 * then redirects to homepage.
 */
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const role = decoded.role;
        const username = decoded.sub;
  
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        
  
        // Redirect and clean up token from URL
        window.location.href = "/";
      } else {
        window.location.href = "/login";
      }
  }, []);

  return <p>Logging in via Google...</p>;
};

export default OAuth2RedirectHandler;
