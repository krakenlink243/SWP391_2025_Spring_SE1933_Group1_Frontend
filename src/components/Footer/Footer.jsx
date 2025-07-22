import React, { forwardRef } from "react"; // Added forwardRef by Phan NT Son 18-06-2025
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Footer = forwardRef((props, ref) => { //Added forwardRef by Phan NT Son 18-06-2025

  const navigate = useNavigate();
  const {t} = useTranslation();
  return (
    <footer className="steam-footer container-fluid py-5" ref={ref}> {/* Added by Phan NT Son 18-06-2025*/}
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="main-content col-lg-8 d-flex flex-column gap-2 justify-content-center align-items-center">
          <div className="footer-logo">
            <img src={`Centurion.svg`} onClick={() => navigate("/")}></img>
          </div>
          <div className="d-flex flex-column align-items-center gap-2">
            <div>© 2025 Centurion Legion | {t('Educational Project')}</div>
            <div className="d-flex flex-row gap-5">
              <div onClick={() => navigate("/terms-of-use")} className="policy-nav" >{t('Terms of use')}</div>
              <div onClick={() => navigate("/privacy-policy")} className="policy-nav">{t('Privacy policy')}</div>
              <div onClick={() => navigate("/contact")} className="policy-nav">{t('Contact')}</div>
            </div>
          </div>
        </div>
        <div className="spacer col-lg-2"></div>
      </div>

    </footer>
  );
});

export default Footer;
