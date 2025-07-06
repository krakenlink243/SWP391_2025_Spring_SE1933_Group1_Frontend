import { useState } from "react";
import './ChatBodyRight.css'
import ChatHistory from "./ChatHistory";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../hooks/useChat";

function ChatBodyRight({ friend }) {

    const [input, setInput] = useState("");
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");
    const CUR_TOKEN = useAuth();
    const friendId = friend?.friendId;
    const { messages, conversation, sendMessages } = useChat(CUR_TOKEN, friendId);


    const handleSend = () => {
        if (input.trim() === "") return;
        sendMessages(conversation.conversationId, currentUser, friend.friendName, input);
        setInput("");
    };

    const currentUser = localStorage.getItem("username");

    // Giới hạn số từ nhập vào là 8000 từ
    const MAX_WORDS = 8000;

    // Hàm kiểm tra và cập nhật input
    const handleInputChange = (e) => {
        const value = e.target.value;
        const words = value.trim().split(/\s+/);
        if (words.length <= MAX_WORDS) {
            setInput(value);
        } else {
            setInput(words.slice(0, MAX_WORDS).join(" "));
        }
    };

    return (
        <div id="right-pane" className="multi-chat-dialog-container d-flex flex-column">
            {friend && (
                <div className="chat-wrapper h-100">
                    <div className="chat-tab" style={{ height: "5%" }}>
                        <div className="friend-box">
                            <div className="friend-avatar h-100 d-flex flex-row align-items-center">
                                <img src={`${friend.friendAvatarUrl ? friend.friendAvatarUrl : UNKNOW_AVATAR_URL}`} alt={friend.friendName}></img>
                            </div>
                            <div className="friend-name">
                                {friend.friendName}
                            </div>
                        </div>
                        <div className="padder-top"></div>
                    </div>
                    <div className="chat-history-scroll" style={{ height: "85%" }}>
                        <ChatHistory
                            pastMessages={conversation?.messages || []}
                            liveMessages={messages}
                            friend={friend}
                        />

                    </div>
                    <div className="chat-entry d-flex flex-row" style={{ height: "10%" }}>
                        <div className="chat-entry-control" style={{ width: "85%" }}>
                            <input
                                type="text"
                                className="form-control"
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleSend();
                                }}
                                maxLength={65535} // optional: limit max chars
                            />
                            <div style={{ fontSize: "12px", color: "#888", position: "absolute", top: "0" }}>
                                {input.trim() === "" ? 0 : input.trim().split(/\s+/).length} / {MAX_WORDS} words
                            </div>
                        </div>
                        <div className="chat-entry-actions d-flex align-items-center justify-content-center" style={{ width: "15%" }}>
                            <div
                                onClick={handleSend}
                                disabled={input.trim() === ""}
                                className={`actions-btn ${input.trim() === "" ? "" : "active"}`}
                            >
                                <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="SVGIcon_Button SVGIcon_Submit"><path fillRule="evenodd" clipRule={"evenodd"} d="M4.16683 8.982C4.10732 8.3908 3.83847 7.42693 4.15486 7.17995C4.46877 6.93489 4.7797 6.90487 5.90123 7.31306L31.1931 17.2282C32.2693 17.6503 32.2686 18.335 31.1931 18.7564L5.90123 28.6715C4.77972 29.1235 4.46864 29.0497 4.15487 28.8049C3.83836 28.5579 4.0953 27.5939 4.15484 27.0028L4.7797 21.2151C4.89862 20.0374 5.92644 18.9801 7.0706 18.854L15.467 18.4429C24.1686 17.9924 24.1686 17.9924 15.467 17.5419L7.0706 17.1313C5.92423 17.0053 4.89825 15.9476 4.7797 14.7706L4.16683 8.982Z" fill="currentColor"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ChatBodyRight;