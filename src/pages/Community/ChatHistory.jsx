import React from "react";
import { prepareChatHistory } from "../../utils/chatUtils";
import './ChatHistory.css';

export default function ChatHistory({ pastMessages, liveMessages, curUserAvatar, friendAvatar }) {
    const days = React.useMemo(
        () => prepareChatHistory(pastMessages, liveMessages),
        [pastMessages, liveMessages]
    );

    const me = localStorage.getItem("username");
    return (
        <div className="chat-history">
            {days.map(dayBlock => (
                <div key={dayBlock.day} className="day-block">
                    <div className="day-header">
                        {new Date(dayBlock.day).toLocaleDateString()}
                    </div>
                    {dayBlock.groups.map((group, i) => (
                        <div
                            key={i}
                            className={
                                group.senderKey === me
                                    ? "message-group user"
                                    : "message-group friend"
                            }
                        >
                            <div className="sender-name text-white">{group.senderName}</div>
                            <div className="bubble">
                                {group.messages.map((msg, j) => (
                                    <div key={j} className="msg-line">
                                        <span className="msg-text">{msg.content}</span>
                                        {/* <span className="msg-time">{msg.time}</span> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
