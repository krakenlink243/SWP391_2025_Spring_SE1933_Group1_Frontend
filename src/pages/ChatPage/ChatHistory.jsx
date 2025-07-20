import React, { useEffect, useRef } from "react";
import { prepareChatHistory, formatGroupTimestamp } from "../../utils/chatUtils";
import './ChatHistory.css';

export default function ChatHistory({
    messages,
    membersLookup,
    currentUsername,
    currentAvatar,
}) {

    const scrollRef = useRef(null);

    // day‐grouped data
    const days = React.useMemo(
        () => prepareChatHistory(messages, membersLookup),
        [messages, membersLookup]
    );

    // auto‐scroll to bottom on new
    useEffect(() => {
        const c = scrollRef.current;
        if (c) c.scrollTop = c.scrollHeight;
    }, [days]);

    return (
        <div className="chat-history" ref={scrollRef}>
            {days.map(({ day, groups }) => (
                <div key={day} className="day-block">
                    <div className="day-header">
                        {new Date(day).toLocaleDateString('vi-VN')}
                    </div>

                    {groups.map((g, idx) => {
                        const isMe = g.senderName === currentUsername;
                        const avatar = isMe ? currentAvatar : g.senderAvatarUrl;
                        return (
                            <div
                                key={idx}
                                className={
                                    isMe ? 'message-group user' : 'message-group friend'
                                }
                            >
                                <div className="sender-small-profile">
                                    <img src={avatar} alt={g.senderName} />
                                    <div>{g.senderName}</div>
                                    <span className="timestamp">
                                        {formatGroupTimestamp(g.groupTimestamp)}
                                    </span>
                                </div>
                                <div className="bubble">
                                    {g.messages.map((m, j) => (
                                        <div key={j} className="msg-line">
                                            <span className="msg-text">{m.content}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
