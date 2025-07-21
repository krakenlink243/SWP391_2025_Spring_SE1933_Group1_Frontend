import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./UserDropBox.css";
import Logout from "../Logout/Logout";
import { Link } from "react-router-dom";

/**
 * @author Phan NT Son
 * @description Component to display a list of actions
 * @param {*} param0
 * @returns
 */
function UserDropBox({ userBalance }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [showLogout, setShowLogout] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Danh sách ngôn ngữ
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  // Load ngôn ngữ từ localStorage khi component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (languageCode) => {
    // Lưu ngôn ngữ vào localStorage
    localStorage.setItem('language', languageCode);
    
    // Thay đổi ngôn ngữ
    i18n.changeLanguage(languageCode);
    
    // Navigate về trang home
    navigate('/');
    
    // Đóng menu
    setShowLanguageMenu(false);
  };

  return (
    <div className="user-drop-box-menu dropdown">
      <div
        className="user-drop-box-avatar dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <span className="user-drop-box-name">{username}</span>
      </div>
      <div className="dropdown-menu">
        <Link className="dropdown-item" to="/profile">
          {t('View my profile')}
        </Link>
        <Link className="dropdown-item" to="/account">
          {t('Account details')}: <span className="item-username">{username}</span>
        </Link>
        <Link className="dropdown-item" to="/library">
          {t('Library')}
        </Link>
        {role == 'Publisher' ? (
          <Link className="dropdown-item" to="/sendgame">
            {t('Request Add Game')}
          </Link>
        ) : null}
        {role == 'Standard' ? (
          <Link className="dropdown-item" to="/sendpublisher">
           {t('Request Publisher')}
          </Link>
        ) : null}
        <Link className="dropdown-item" to="/account/wallet">
          {t('View my wallet')}:{" "}
          <span style={{ color: "#4cb4ff" }}>
            {userBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </Link>

        {/* Language Switcher - NO GAP VERSION */}
        <div 
          className="dropdown-item language-switcher-container"
          style={{ position: "relative", padding: 0 }}
          onMouseEnter={() => setShowLanguageMenu(true)}
          onMouseLeave={() => setShowLanguageMenu(false)}
        >
          <span 
            style={{ 
              padding: "6px 16px", 
              display: "block",
              cursor: "pointer"
            }}
          >
            {t('Change language')}
          </span>
          
          {/* Language Submenu - ATTACHED WITHOUT GAP */}
          {showLanguageMenu && (
            <div 
              className="language-submenu"
              style={{
                position: "absolute",
                left: "100%",
                top: "0",
                backgroundColor: "#2a475e",
                border: "1px solid #3c5a73",
                borderRadius: "4px",
                minWidth: "150px",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`language-item ${
                    i18n.language === language.code ? 'active' : ''
                  }`}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: i18n.language === language.code ? "#4cb4ff" : "transparent",
                    color: i18n.language === language.code ? "#fff" : "#c7d5e0"
                  }}
                  onClick={() => handleLanguageChange(language.code)}
                  onMouseEnter={(e) => {
                    if (i18n.language !== language.code) {
                      e.target.style.backgroundColor = "#3c5a73";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i18n.language !== language.code) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                  {i18n.language === language.code && (
                    <span className="language-check" style={{ marginLeft: "auto" }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* HẾT PHẦN THÊM */}

        <span
          className="dropdown-item"
          style={{ cursor: "pointer" }}
          onClick={() => setShowLogout(true)}
        >
          {t('Sign out of account…')}
        </span>
      </div>
      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
    </div>
  );
}

export default UserDropBox;