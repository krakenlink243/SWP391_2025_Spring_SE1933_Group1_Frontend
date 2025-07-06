import React, { useEffect, useRef } from "react";
import { prepareChatHistory } from "../../utils/chatUtils";
import './ChatHistory.css';

export default function ChatHistory({ pastMessages, liveMessages, friend }) {
    const CUR_USER_AVATAR = localStorage.getItem("avatarUrl");
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");
    const scrollRef = useRef(null);

    // Hàm helper để định dạng ngày giờ theo kiểu "HH:mm DayOfWeek, DD/M/YYYY"
    const formatGroupTimestamp = (date) => {
        if (!date) return '';

        // Ví dụ: 0:09 Thứ Tư, 11/6/2025
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };

        // Thay 'vi-VN' bằng 'en-US' nếu muốn hiển thị tiếng Anh
        const locale = 'vi-VN';

        const timeString = new Date(date).toLocaleTimeString(locale, timeOptions);
        const dateString = new Date(date).toLocaleDateString(locale, dateOptions);

        return `${timeString} ${dateString}`;
    };

    const days = React.useMemo(
        () => prepareChatHistory(pastMessages, liveMessages),
        [pastMessages, liveMessages]
    );

    const me = localStorage.getItem("username");

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [days]);

    return (
        <div className="chat-history" ref={scrollRef}>
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
                            <div className="sender-small-profile">
                                <div className="h-100">
                                    <img src={group.senderName === friend.friendName ?
                                        (friend.friendAvatar ? friend.friendAvatar : UNKNOW_AVATAR_URL)
                                        :
                                        CUR_USER_AVATAR}></img>
                                </div>
                                <div>{group.senderName}</div>
                                <span className="timestamp">{formatGroupTimestamp(group.groupTimestamp)}</span>
                            </div>
                            <div className="bubble">
                                {group.messages.map((msg, j) => (
                                    <div key={j} className="msg-line">
                                        <span className="msg-text">{msg.content}</span>
                                        <div></div>
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
