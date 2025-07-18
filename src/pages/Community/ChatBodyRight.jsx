import React, { useState, useMemo } from "react";
import './ChatBodyRight.css'
import ChatHistory from "./ChatHistory";
import { useAuth } from "../../context/AuthContext";
import { useConversation } from "../../hooks/useConversation";

function ChatBodyRight({ curChat, setOpenPopup }) {

    const [input, setInput] = useState("");
    const { token } = useAuth();
    const [showGroupDetail, setShowGroupDetail] = useState(true);
    const { conversation, members, messages, sendMessages } =
        useConversation(token, curChat);

    const sortedMembers = [...members].sort((a, b) => {
        return (b.isAdmin === true) - (a.isAdmin === true);
    });


    // build membersLookup exactly as before
    const membersLookup = useMemo(() => {
        if (curChat?.type === 'group') {
            return members.reduce((acc, m) => {
                acc[m.memberId] = { username: m.memberName, avatarUrl: m.memberAvatar };
                return acc;
            }, {});
        } else if (conversation) {
            const meId = localStorage.getItem('userId');
            return {
                [meId]: {
                    username: localStorage.getItem('username'),
                    avatarUrl: localStorage.getItem('avatarUrl'),
                },
                [curChat.id]: {
                    username: curChat.name,
                    avatarUrl: curChat.avatarUrl,
                },
            };
        }
        return {};
    }, [curChat, members, conversation]);


    const handleSend = () => {
        if (!input.trim()) return;

        if (curChat.type === 'group') {
            sendMessages(input);
        } else {
            sendMessages(input);
        }

        setInput('');
    };

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
            {curChat && (
                <div className="chat-wrapper h-100">
                    <div className="chat-tab" style={{ height: "5%" }}>
                        <div className="current-chat-box">
                            <div className="current-chat-avatar h-100 d-flex flex-row align-items-center">
                                <img src={curChat.avatarUrl}
                                    alt={curChat.name} ></img>
                            </div>
                            <div className="current-chat-name">
                                {curChat.name}
                            </div>
                            <div className="current-chat-icon">
                                ✕
                            </div>
                        </div>
                    </div>
                    <div className="middle-body" style={{ height: "85%" }}>
                        <div className="padder-top" style={{ height: curChat.type === 'group' ? "60px" : "4px" }}>
                            {
                                curChat.type === 'group' && (
                                    <div className="padder-top-content h-100 d-flex align-items-center justify-content-end">
                                        <div className="setting-icon" onClick={() => setOpenPopup(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-100" version="1.1" x="0px" y="0px" viewBox="0 0 600 600"><g><path d="M256,0C126.6,0,21.3,104.7,21.3,233.7c0,65.9,26.5,125.4,74.7,168.3v99.3c0,3.8,2,7.4,5.3,9.2c1.7,1,3.5,1.5,5.3,1.5   c1.8,0,3.7-0.5,5.4-1.5l85.8-50.3c18.9,4.8,38.4,7.3,58.1,7.3c129.4,0,234.7-104.9,234.7-233.7C490.7,104.7,385.4,0,256,0z    M405.3,254.1L370,260c-3,13.5-8.3,26-15.5,37.3l20.8,29.2L347.8,354l-29.2-20.8c-11.3,7.2-23.8,12.5-37.3,15.5l-5.9,35.3h-39   l-5.9-35.3c-13.5-3-26-8.3-37.3-15.5L164.2,354l-27.5-27.5l20.8-29.2C150.3,286,145,273.5,142,260l-35.3-5.9v-39l35.3-5.9   c3-13.5,8.3-26,15.5-37.3l-20.8-29.2l27.5-27.5l29.2,20.8c11.3-7.2,23.8-12.5,37.3-15.5l5.9-35.3h39l5.9,35.3   c13.5,3,26,8.3,37.3,15.5l29.2-20.8l27.5,27.5L354.5,172c7.2,11.3,12.5,23.8,15.5,37.3l35.3,5.9V254.1z"></path><circle cx="256" cy="234.6" r="45.9"></circle></g></svg>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="chat-history-container h-100" style={{ height: curChat.type === 'group' ? "calc(100% - 60px)" : "calc(100% - 4px)" }}>
                            <div
                                className={`chat-history-wrapper h-100`}
                                style={{
                                    width:
                                        curChat.type === 'group'
                                            ? showGroupDetail
                                                ? '85%'
                                                : 'calc(100% - 40px)'
                                            : '100%',
                                }}
                            >    <ChatHistory
                                    messages={messages}
                                    membersLookup={membersLookup}
                                    currentUsername={localStorage.getItem("username")}
                                    currentAvatar={localStorage.getItem("avatarUrl")}
                                />
                            </div>
                            {curChat.type === 'group' &&
                                (
                                    <div className="group-chat-detail h-100" style={{ width: `${showGroupDetail ? "15%" : "36px"}` }}>
                                        <div className="toggle-btn-detail" onClick={() => setShowGroupDetail(prev => !prev)}>
                                            {showGroupDetail ? "⮞" : "⮜"}
                                        </div>
                                        {
                                            sortedMembers.map((member) =>
                                            (
                                                <div className="member" key={member.memberId}>
                                                    <div className="member-avatar">
                                                        <img src={`${member.memberAvatar}`} className="w-100 h-100"></img>
                                                    </div>
                                                    {
                                                        showGroupDetail && (
                                                            <div className="member-name">{member.memberName}{member.admin && " (Admin)"}</div>
                                                        )
                                                    }
                                                </div>
                                            )
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
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
            )
            }
        </div >
    );
}
export default ChatBodyRight;