import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChatHeader = forwardRef((props, ref) => {
    const username = localStorage.getItem("username");
    const { t } = useTranslation();
    return (
        <div className="chat-header-container d-flex align-items-center" ref={ref}>
            <div className="chat-header-logo col-lg-1 align-content-center">
                <Link to={"/"}>
                    <img src="/Centurion.svg" alt="Centurion Logo" className="logo w-100" />
                </Link>
            </div>
            <div className="chat-header-nav col-lg-11 d-flex gap-2">
                <Link to={'/'}>{t('Store')}</Link>
                <Link to={'#'}>{t('Community')}</Link>
                <Link to={'/profile'}>{username}</Link>
                <Link to={'/feedbackhub'}>{t('Support')}</Link>
            </div>
        </div>
    );
})

export default ChatHeader;