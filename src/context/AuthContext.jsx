import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  token: null,
  user: null,
  setToken: () => { },
  logout: () => { }
});

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;
    try {
      const decoded = jwtDecode(storedToken);
      // Check exp on load
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        clearAuthData();
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  })

  const setToken = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      const now = Math.floor(Date.now() / 1000);
      if (!decoded.exp || decoded.exp < now) {
        logout();
        return;
      }
      localStorage.setItem("token", newToken);
      localStorage.setItem("expDate", decoded.exp);
      localStorage.setItem("username", decoded.sub || decoded.username);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("avatarUrl", decoded.avatarUrl || "");
      localStorage.setItem("banned", decoded.banned || false);
      setUser(decoded);
      setTokenState(newToken);
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expDate");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("banned");
    setTokenState(null);
    setUser(null);
  };

  const logout = () => {
    clearAuthData();
    window.location.href = "/";
  };

  useEffect(() => {
    // Khi app mount, kiểm tra lại token 1 lần duy nhất
    const expDate = localStorage.getItem("expDate");
    const now = Math.floor(Date.now() / 1000);
    if (expDate && Number(expDate) < now) {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook dùng trong các component
export const useAuth = () => useContext(AuthContext);
