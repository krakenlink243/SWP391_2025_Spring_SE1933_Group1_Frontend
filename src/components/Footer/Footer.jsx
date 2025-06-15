import React from "react";
import "./Footer.css";
import ValveLogo from "/footerLogo_valve_new.png"; // Đường dẫn đến logo Valve
import SteamLogo from "/logo_steam.svg"; // Đường dẫn đến logo Steam

const Footer = () => {
  return (
    <footer className="steam-footer">
      <div className="footer-top">
        <div className="footer-copyright">
          <img src={ValveLogo} alt="Valve Logo" className="valve-logo" />
          <span>© 2024 Valve Corporation. All rights reserved.</span>
          <span>
            All trademarks are property of their respective owners in the US and
            other countries.
          </span>
          <span>VAT included in all prices where applicable.</span>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>|<a href="#">Legal</a>|
          <a href="#">Steam Subscriber Agreement</a>|<a href="#">Refunds</a>|
          <a href="#">Cookies</a>
        </div>
        <img src={SteamLogo} alt="Steam Logo" className="steam-logo" />
      </div>
      <div className="footer-bottom">
        <div className="bottom-links">
          <a href="#">About Valve</a>
          <a href="#">Jobs</a>
          <a href="#">Steamworks</a>
          <a href="#">Steam Distribution</a>
          <a href="#">Support</a>
          <a href="#">Gift Cards</a>
        </div>
        <div className="social-icons">
          <a href="#" className="social-icon">
            f
          </a>
          <a href="#" className="social-icon">
            X
          </a>
          <a href="#" className="social-icon">
            {/* Biểu tượng */}
          </a>
          <a href="#" className="social-icon">
            {/* Biểu tượng */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
