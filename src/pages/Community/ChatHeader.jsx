import { forwardRef } from "react";

const ChatHeader = forwardRef((props, ref) => {
    const username = localStorage.getItem("username");

    return (
        <div className="chat-header-container d-flex align-items-center" ref={ref}>
            <div className="chat-header-logo col-lg-1 align-content-center">
                <a href="/"><img src="/logo_steam.svg" alt="Steam Logo" className="logo w-100" /></a>
            </div>
            <div className="chat-header-nav col-lg-11 d-flex gap-2">
                <a href="/">STORE</a>
                <a href="#">COMMUNITY</a>
                <a href="/profile">{username}</a>
                <a href="#">SUPPORT</a>
            </div>
        </div>
    );
})

export default ChatHeader;