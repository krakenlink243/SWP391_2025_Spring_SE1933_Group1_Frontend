import { forwardRef, useContext } from "react";
import "./Navbar.css"; // Hoặc Navbar.module.css nếu dùng CSS Modules
import SearchBar from "../SearchBar/SearchBar"; // Import component SearchBar
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from "../../context/AppContext";
import useIsMobile from "../../hooks/useIsMobile";
import { useTranslation } from "react-i18next";

/**
 * Origin @author: TS Huy
 * Refactor and re-design @author: Phan NT Son
 * @returns 
 */
const Navbar = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { cartTotal } = useContext(AppContext);

  if (!isMobile) {

    return (
      <div className="container-fluid store-header" role="navigation" ref={ref}>
        <div className="row">
          <div className="spacer col-lg-2"></div>
          <div className="col-lg-8">
            <div className="content">
              {
                cartTotal > 0 && (
                  <div className="cart-area">
                    <Link to={'/cart'}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="cart-icon"><path d="M33.63 8.05005L30.11 20.81C29.9416 21.453 29.5645 22.0219 29.0378 22.4273C28.5111 22.8328 27.8647 23.0518 27.2 23.05H14.75C14.1022 23.0507 13.4715 22.8416 12.9524 22.4541C12.4333 22.0665 12.0536 21.5213 11.87 20.9L7.56 8.05005H2V4.05005H8.28C8.90845 4.05122 9.52067 4.24973 10.0302 4.61755C10.5398 4.98538 10.921 5.50394 11.12 6.10005L11.78 8.10005L33.63 8.05005ZM15 27.05C14.5055 27.05 14.0222 27.1967 13.6111 27.4714C13.2 27.7461 12.8795 28.1365 12.6903 28.5933C12.5011 29.0502 12.4516 29.5528 12.548 30.0378C12.6445 30.5227 12.8826 30.9682 13.2322 31.3178C13.5819 31.6674 14.0273 31.9056 14.5123 32.002C14.9972 32.0985 15.4999 32.049 15.9567 31.8597C16.4135 31.6705 16.804 31.3501 17.0787 30.939C17.3534 30.5278 17.5 30.0445 17.5 29.55C17.5 28.887 17.2366 28.2511 16.7678 27.7823C16.2989 27.3134 15.663 27.05 15 27.05ZM27 27.05C26.5055 27.05 26.0222 27.1967 25.6111 27.4714C25.2 27.7461 24.8795 28.1365 24.6903 28.5933C24.5011 29.0502 24.4516 29.5528 24.548 30.0378C24.6445 30.5227 24.8826 30.9682 25.2322 31.3178C25.5819 31.6674 26.0273 31.9056 26.5123 32.002C26.9972 32.0985 27.4999 32.049 27.9567 31.8597C28.4135 31.6705 28.804 31.3501 29.0787 30.939C29.3534 30.5278 29.5 30.0445 29.5 29.55C29.5 28.887 29.2366 28.2511 28.7678 27.7823C28.2989 27.3134 27.663 27.05 27 27.05Z" fill="currentColor"></path></svg>
                      {t('Cart')} ({cartTotal})
                    </Link>
                  </div>
                )
              }
              <div className="store-nav-area">
                <div className="store-nav-bg">
                  <div className="store-nav">
                    <div className="tab" onClick={() => navigate("/game")}><span className="pulldown"><a>{t('Your Store')}</a></span></div>
                    <div className="search-flex-spacer"></div>
                    <div className="search-area">
                      <SearchBar />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="spacer col-lg-2"></div>

        </div>

      </div>
    );
  } else {
    return (
      <div>

      </div>
    );
  }
});

export default Navbar;
