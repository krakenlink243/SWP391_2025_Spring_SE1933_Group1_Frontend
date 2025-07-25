import { useContext, useEffect, useState } from "react";
import './BlockedTab.css';
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

function BlockedTab() {

    const { blockedList } = useContext(AppContext);

    const curUserId = localStorage.getItem("userId")
    const [bList, setBList] = useState([]);

    useEffect(() => {
        const filtered = blockedList.filter(b => b.blockerId === Number(curUserId));
        setBList(filtered);
    }, [blockedList])

    const { t } = useTranslation();

    const navigate = useNavigate();


    return (
        <div className="blocked-tab">
            <div className="blocked-tab-header">
                <div className="status">
                    {t('Blocked')}
                </div>
            </div>
            <div className="blocked-tab-body d-flex flex-row gap-2 flex-wrap">
                {bList.length == 0 && (
                    <div className="result-not-found">{t('Sorry, there are no blocked players to show.')}</div>
                )}
                {
                    bList.map((blckU) => (
                        <div key={blckU.friendId} className="blocked-user-item d-flex flex-row gap-2 align-items-center" onClick={() => navigate(`/profile/${blckU.friendId}`)}>
                            <div className="blocked-user-avatar">
                                <img
                                    src={blckU.blockedAvatar}
                                    alt={blckU.blockedName}
                                />
                            </div>
                            <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
                                <div className="blocked-user-name">{blckU.blockedName}</div>
                                <div className="blocked-user-badge">{t('Blocked')}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

};
export default BlockedTab;