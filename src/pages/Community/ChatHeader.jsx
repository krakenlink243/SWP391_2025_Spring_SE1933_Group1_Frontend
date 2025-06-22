import { Navigate } from "react-router-dom";
function ChatHeader() {
    const token = localStorage.getItem("token")
    if (!token) {
        return <Navigate to={"/"} replace />
    } else {
        const username = localStorage.getItem("username");
        const avatarUrl = localStorage.getItem("avatarUrl");

        return (
            <div className="container-fluid h-100">
                <div className="chat-header-container row d-flex align-items-center p-2">
                    <div className="chat-header-logo col-lg-1 align-content-center">
                        <a href="/"><img src="/logo_steam.svg" alt="Steam Logo" className="logo w-100" /></a>
                    </div>
                    <div className="chat-header-nav col-lg-11 d-flex gap-2">
                        <a href="/">STORE</a>
                        <a href="#">COMMUNITY</a>
                        <a href="#">{username}</a>
                        <a href="#">SUPPORT</a>
                    </div>
                </div>
                <div className="row h-100">
                    <div className="chat-main d-flex flex-row h-100">
                        <div className="frineds-list-container">
                            <div className="friend-list">
                                <div className="friend-list-header-container">
                                    <div className="current-user online d-flex flex-row">
                                        <img src={avatarUrl}></img>
                                        <div>{username}</div>
                                    </div>
                                    <div className="quick-access-friend">

                                    </div>
                                    <div className="search-bar">

                                    </div>
                                </div>
                                <div className="friend-list-content">
                                    <div className="online-friends">
                                        {/* Items here*/}
                                        <div className="friend online">

                                        </div>
                                    </div>
                                    <div className="offline-friend">
                                        <div className="friend online">

                                        </div>
                                    </div>
                                </div>
                                <div className="friend-list-footer">

                                </div>
                            </div>
                        </div>
                        <div className="multi-chat-dialog">

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ChatHeader;