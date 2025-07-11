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
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  })

  const setToken = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem("token", newToken);
      localStorage.setItem("expDate", decoded.exp);
      localStorage.setItem("username", decoded.sub || decoded.username);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("avatarUrl", decoded.avatarUrl || "");
      setUser(decoded);
      setTokenState(newToken);
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    setTokenState(null);
    setUser(null);
  };

  // Auto logout nếu token hết hạn (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      const expDate = localStorage.getItem("expDate");
      const now = Math.floor(Date.now() / 1000);
      if (expDate && expDate < now) logout();
    }, 60000); // check mỗi phút

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook dùng trong các component
export const useAuth = () => useContext(AuthContext);
