import { useContext, useEffect, useState } from "react";
import Split from "split.js";
import ChatBodyLeft from "./ChatBodyLeft";
import ChatBodyRight from "./ChatBodyRight";
import './ChatBody.css';

import { AppContext } from "../../context/AppContext";
import GroupSettingPopup from "./GroupSettingPopup";
import AddGroupPopup from "./AddGroupPopup";
import AddMemberPopup from "./AddMemberPopup";
import { useAuth } from "../../context/AuthContext";
import { useConversation } from "../../hooks/useConversation";

function ChatBody({ bodyH }) {

    const [curChat, setCurChat] = useState(null);

    const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
    const [openGroupSettingPopup, setOpenGroupSettingPopup] = useState(null);
    const [openAddMemberPopup, setOpenAddMemberPopup] = useState(null);
    const { token } = useAuth();
    const { members } = useConversation(token, curChat);

    const { groupChats } = useContext(AppContext);

    useEffect(() => {

        const split = Split(['#left-pane', '#right-pane'], {
            sizes: [20, 80],
            minSize: 200,
            maxSize: [440, Infinity],
            gutterSize: 5,
            direction: 'horizontal',
        });

        return () => split.destroy()
    }, [])


    useEffect(() => {
        if (!curChat) return;

        const isGroupRemoved = () => {
            for (const group of groupChats) {
                if (group.groupId === curChat.id)
                    return false;
            }
            return true;
        };

        if (curChat.type === 'group') {
            if (isGroupRemoved()) {
                setCurChat(null);
            }
        }
    }, [groupChats]);


    return (
        <div className="chat-main split d-flex flex-row p-0" style={{ height: `${bodyH}px` }}>
            {
                openAddGroupPopup && (
                    <AddGroupPopup
                        setOpenPopup={setOpenAddGroupPopup}
                    />
                )
            }
            {openGroupSettingPopup && (
                <GroupSettingPopup
                    groupSetting={openGroupSettingPopup}
                    setOpenPopup={setOpenGroupSettingPopup}
                    setCurChat={setCurChat}
                />
            )
            }
            {
                openAddMemberPopup && (
                    <AddMemberPopup
                        groupId={curChat.id}
                        setOpenPopup={setOpenAddMemberPopup}
                        groupMembers={members}
                    />
                )
            }

            <ChatBodyLeft
                setCurChat={setCurChat}
                setOpenPopup={setOpenAddGroupPopup}
            />
            <ChatBodyRight
                curChat={curChat}
                setSettingPopup={setOpenGroupSettingPopup}
                setAddMemberPopup={setOpenAddMemberPopup}
                setCurChat={setCurChat}
            />

        </div>
    );
}

export default ChatBody;