import React, { useState, useMemo, useEffect } from "react";
import './ChatBodyRight.css'
import ChatHistory from "./ChatHistory";
import { useAuth } from "../../context/AuthContext";
import { useConversation } from "../../hooks/useConversation";
import GroupAvatar from "./GroupAvatar";

function ChatBodyRight({ curChat, setSettingPopup, setAddMemberPopup, setCurChat }) {

    const [input, setInput] = useState("");
    const { token } = useAuth();
    const [showGroupDetail, setShowGroupDetail] = useState(true);
    const { conversation, members, messages, sendMessages } =
        useConversation(token, curChat);
    const meId = localStorage.getItem('userId');
    const [sortedMembers, setSortedMembers] = useState([]);

    useEffect(() => {
        setSortedMembers(
            [...members].sort((a, b) => (b.admin === true) - (a.admin === true))
        );
    }, [members]);

    // build membersLookup exactly as before
    const membersLookup = useMemo(() => {
        if (!curChat) return;
        if (curChat?.type === 'group') {
            return members.reduce((acc, m) => {
                acc[m.memberId] = { username: m.memberName, avatarUrl: m.memberAvatar };
                return acc;
            }, {});
        } else if (conversation) {
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
                                {
                                    curChat.type === 'group' ? (
                                        <div className="group-avatar-container">
                                            <GroupAvatar />
                                        </div>
                                    ) : (
                                        <img className="avatar" src={curChat.avatarUrl}
                                            alt={curChat.name} ></img>
                                    )
                                }

                            </div>
                            <div className="current-chat-name">
                                {curChat.name}
                            </div>
                            <div className="current-chat-icon" onClick={() => setCurChat(null)}>
                                ✕
                            </div>
                        </div>
                    </div>
                    <div className="middle-body" style={{ height: "85%" }}>
                        <div className="padder-top" style={{ height: curChat.type === 'group' ? "60px" : "4px" }}>
                            {
                                curChat.type === 'group' && (
                                    <div className="padder-top-content h-100 d-flex align-items-center justify-content-between gap-3 p-2">
                                        <div className="group-title h-100 d-flex align-items-center gap-2">
                                            <div className="group-avatar-container">
                                                <GroupAvatar />
                                            </div>
                                            <div className="group-name" >
                                                {curChat.name}
                                            </div>
                                        </div>
                                        <div className="user-actions d-flex flex-row align-items-center gap-2">
                                            <div className="setting-icon" onClick={() => setAddMemberPopup(true)}>
                                                <svg version="1.1" id="Layer_5" xmlns="http://www.w3.org/2000/svg" className="h-100 w-100" x="0px" y="0px" width="256px" height="255.999px" viewBox="0 0 256 255.999"><path d="M165.678,20.535c-17.251,0-31.386,14.135-31.386,31.386c0,17.252,14.135,31.386,31.386,31.386 c17.251,0,31.386-14.134,31.386-31.386C197.063,34.67,182.929,20.535,165.678,20.535z"></path><path d="M165.678,93.121c24.995,0,45.335,20.34,45.335,45.335v52.31c0,3.853-3.123,6.975-6.975,6.975h-13.95v34.874 c0,3.852-3.123,6.974-6.974,6.975h-34.874c-3.852-0.001-6.974-3.123-6.975-6.975v-34.874h-13.95c-3.852,0-6.974-3.123-6.974-6.975 v-52.31C120.343,113.461,140.683,93.121,165.678,93.121z"></path><g className="invitePlus"><line fill="none" stroke="#ffffff" stroke-width="22" stroke-miterlimit="10" x1="14" y1="128" x2="101.5" y2="128"></line><line fill="none" stroke="#ffffff" stroke-width="22" strokeMiterlimit="10" x1="57.75" y1="84.25" x2="57.75" y2="171.75"></line></g></svg>
                                            </div>
                                            <div className="setting-icon" onClick={() => setSettingPopup({
                                                groupId: curChat.id,
                                                isAdmin: meId === String(sortedMembers[0].memberId) && sortedMembers[0].admin
                                            })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-100 w-100" version="1.1" x="0px" y="0px" viewBox="0 0 600 600"><g><path d="M256,0C126.6,0,21.3,104.7,21.3,233.7c0,65.9,26.5,125.4,74.7,168.3v99.3c0,3.8,2,7.4,5.3,9.2c1.7,1,3.5,1.5,5.3,1.5   c1.8,0,3.7-0.5,5.4-1.5l85.8-50.3c18.9,4.8,38.4,7.3,58.1,7.3c129.4,0,234.7-104.9,234.7-233.7C490.7,104.7,385.4,0,256,0z    M405.3,254.1L370,260c-3,13.5-8.3,26-15.5,37.3l20.8,29.2L347.8,354l-29.2-20.8c-11.3,7.2-23.8,12.5-37.3,15.5l-5.9,35.3h-39   l-5.9-35.3c-13.5-3-26-8.3-37.3-15.5L164.2,354l-27.5-27.5l20.8-29.2C150.3,286,145,273.5,142,260l-35.3-5.9v-39l35.3-5.9   c3-13.5,8.3-26,15.5-37.3l-20.8-29.2l27.5-27.5l29.2,20.8c11.3-7.2,23.8-12.5,37.3-15.5l5.9-35.3h39l5.9,35.3   c13.5,3,26,8.3,37.3,15.5l29.2-20.8l27.5,27.5L354.5,172c7.2,11.3,12.5,23.8,15.5,37.3l35.3,5.9V254.1z"></path><circle cx="256" cy="234.6" r="45.9"></circle></g></svg>
                                            </div>
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                        <div className="chat-history-container" style={{ height: curChat.type === 'group' ? "calc(100% - 60px)" : "calc(100% - 4px)" }}>
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
                                <div className="padder-end">
                                </div>
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
                                                        <div className={`member-icon ${member.admin ? 'owner' : 'is-member'}`}>
                                                            {
                                                                member.admin ? (
                                                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="crown h-100 w-100" x="0px" y="0px" width="256px" height="256px" viewBox="0 0 256 256"><g><path d="M239.874,94.963l-31.115,21.325c-18.18,12.586-43.351,5.594-52.44-14.333l-23.772-50.692c-2.099-4.194-8.041-4.194-9.789,0 l-23.074,50.343c-9.439,20.627-35.31,27.27-53.49,13.983L16.128,93.565c-4.195-3.147-10.139,1.049-8.391,6.293l31.464,106.628 c0.35,1.049,1.398,1.397,2.098,1.397h173.752c1.049,0,1.749-0.698,2.098-1.397l31.115-104.53 C250.012,96.36,244.068,91.816,239.874,94.963z"></path></g></svg>

                                                                ) : (
                                                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-100 w-100" x="0px" y="0px" width="256px" height="256px" viewBox="0 0 256 256"><g className="Outline"><g transform="matrix(1.34048,0,0,1.34048,-10.0942,-5.50445)"><path d="M102.239,90.394c-22.556,0-40.906-18.351-40.906-40.906c0-22.556,18.35-40.906,40.906-40.906s40.906,18.35,40.906,40.906 C143.145,72.043,124.795,90.394,102.239,90.394z"></path></g><path d="M127.453,250.212c-30.208,0-52.086-4.188-65.028-12.45c-12.507-7.983-13.141-17.484-13.141-19.308v-41.781 c0-20.554,5.356-38.104,15.489-50.754c11.63-14.519,29.216-22.193,50.858-22.194h23.646c21.643,0,39.229,7.674,50.858,22.193 c10.133,12.65,15.488,30.201,15.488,50.754v41.751c0.011,2.202-0.586,8.058-6.43,14.175 c-11.164,11.687-35.301,17.613-71.732,17.613C127.458,250.212,127.458,250.212,127.453,250.212z"></path><path className="WavingArm" opacity="0" d="M87.625,170.102c-5.877,0-14.85-1.804-24.219-10.4c-8.677-7.961-20.959-20.438-30.563-31.048 c-18.766-20.732-21.125-26.658-19.522-32.832c1.463-5.64,10.288-27.077,26.729-28.926c0.429-0.048,0.867-0.072,1.303-0.072 c7.609,0,14.543,6.335,38.063,31.516c7.141,7.645,14.524,15.549,18.002,18.33l0.803,0.641c5.551,4.432,11.291,9.015,15.104,14.136 c8.477,11.383,3.634,20.705,1.158,24.185C108.034,164.692,97.995,170.102,87.625,170.102z"></path></g><g className="foreground"><g transform="matrix(1.34048,0,0,1.34048,-10.0942,-5.50445)"><circle fill="currentColor" cx="102.239" cy="49.488" r="33.446"></circle></g><path fill="currentColor" d="M195.624,218.454v-41.781c0-34.743-16.666-62.948-56.347-62.948h-11.822h-0.997h-10.826 c-39.68,0.001-56.348,28.205-56.348,62.948v41.781c0,0,0,21.758,68.169,21.758C196.62,240.214,195.624,218.454,195.624,218.454z"></path><path className="WavingArm" opacity="0" d="M41.167,76.833c6.53-0.734,39.348,39.127,50.007,47.647c10.659,8.52,21.327,16.686,15.16,25.353 s-20.646,16.74-36.167,2.5 s-48.516-48.801-47.167-54S31.599,77.909,41.167,76.833z"></path></g></svg>

                                                                )
                                                            }
                                                        </div>
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