import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  token: null,
  setToken: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));

  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("expDate");
    setTokenState(null);
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
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook dùng trong các component
export const useAuth = () => useContext(AuthContext);
