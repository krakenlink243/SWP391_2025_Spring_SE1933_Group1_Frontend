import axios from "axios";
import { sendMessage, connectSocket } from "../../services/chatSocketService";
import { useEffect, useState, useRef } from "react";
import './ChatBodyRight.css'

function ChatBodyRight({ friend }) {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const didConnectRef = useRef(false);
    const [conversation, setConversation] = useState();
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");

    const loadConversation = () => {
        axios.get(`http://localhost:8080/user/conversation/${friend.friendId}`)
            .then((resp) => {
                setConversation(resp.data);
                console.log(resp.data);
            })
            .catch((err) => { console.log("Error load conversation: " + err) })
    }

    useEffect(() => {
        if (friend) {
            loadConversation();
        }
    }, [friend]);

    useEffect(() => {
        if (didConnectRef.current) return;
        didConnectRef.current = true;

        connectSocket((message) => {
            setMessages(prev => [...prev, message]);
        });

        // Optional cleanup
        return () => {
            didConnectRef.current = false;
        };
    }, []);

    const handleSend = () => {
        if (input.trim() === "") return;
        sendMessage(conversation.conversationId, currentUser, friend.friendName, input);
        setMessages(prev => [...prev, { senderUsername: currentUser, content: input }]);
        setInput("");
    };

    const currentUser = localStorage.getItem("username");

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
                    </div>
                    <div className="chat-history-scroll" style={{ height: "85%" }}>
                        <div className="padder-top"></div>
                        {
                            conversation && conversation.messages && conversation.messages.map((message, idx) => (
                                <div key={idx}>{message.messageContent}</div>
                            ))
                        }
                        {
                            messages.map((message, idx) => (
                                <div key={`new-${idx}`}>{message.content}</div>
                            ))
                        }
                        <div className="chat-message-block is-friend">
                            <div className="chat-speaker">

                            </div>
                            <div className="msg"></div>
                        </div>
                        <div className="chat-message-block is-user">
                            <div className="chat-speaker">

                            </div>
                            <div className="msg"></div>

                        </div>

                    </div>
                    <div className="chat-entry d-flex flex-row" style={{ height: "10%" }}>
                        <div className="chat-entry-control" style={{ width: "85%" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleSend();
                                }}
                            />
                        </div>
                        <div className="chat-entry-actions d-flex align-items-center justify-content-center" style={{ width: "15%" }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleSend}
                                disabled={input.trim() === ""}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ChatBodyRight;