function ChatBodyLeft() {
    const avatarUrl = localStorage.getItem("avatarUrl");
    const username = localStorage.getItem("username");

    return (
        <div id="left-pane" className="frineds-list-container bg-light">
            <div className="friend-list">
                <div className="friend-list-header-container">
                    <div className="current-user online d-flex flex-row">
                        <svg class="status-header-glow" width="100%" height="132" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="exampleGradient" cx="50%" cy="50%" r="50%" fx="35%" fy="30%"><stop offset="10%" stop-color="gold"></stop><stop offset="95%" stop-color="green"></stop></radialGradient></defs><ellipse cx="5%" cy="28%" rx="65%" ry="60%" fill="url(#exampleGradient)"></ellipse></svg>
                        <div className="avatar-and-user d-flex">
                            <div className="current-avatar">
                                <img src={avatarUrl}></img>
                            </div>
                            <div className="label-holder d-flex flex-column">
                                <div>{username}</div>
                                <div>Online</div>
                            </div>
                        </div>

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
    );
}
export default ChatBodyLeft;