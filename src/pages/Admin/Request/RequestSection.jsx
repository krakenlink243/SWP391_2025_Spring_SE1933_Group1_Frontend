import { useEffect } from "react";
import GameApprovePage from "./GameApprovePage";
import PublisherApprovePage from "./PublisherApprovePage";
import FeedbackApprovePage from "./FeedbackApprovePage";
import { useNavigate, useParams } from "react-router-dom";
import './RequestSection.css';
import { useTranslation } from "react-i18next";

export default function RequestSection() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tabKeys = ['game', 'publisher', 'feedback'];
    const curTab = tabKeys.indexOf(tab);
    const currentIndex = curTab === -1 ? 0 : curTab;

    const tabs = [
        <GameApprovePage />,
        <PublisherApprovePage />,
        <FeedbackApprovePage />
    ];

    // useEffect(() => {
    //     if (!tab) {
    //         navigate("/admin/request/game", { replace: true });
    //     }
    // }, [tab]);

    const handleChangeTab = (indx) => {
        navigate(`/admin/request/${tabKeys[indx]}`);
    };

    return (
        <div className="request-section">
            <div className="request-section-nav d-flex flex-row justify-content-around w-100 h-100">
                <div
                    className={`nav-item${currentIndex === 0 ? " active" : ""}`}
                    onClick={() => handleChangeTab(0)}
                >
                    {t('Game Request')}
                </div>
                <div
                    className={`nav-item${currentIndex === 1 ? " active" : ""}`}
                    onClick={() => handleChangeTab(1)}
                >
                    {t('Publisher Request')}
                </div>
                <div
                    className={`nav-item${currentIndex === 2 ? " active" : ""}`}
                    onClick={() => handleChangeTab(2)}
                >
                    {t('Feedback')}
                </div>
            </div>
            <div className="request-section-body">
                {tabs[currentIndex]}
            </div>
        </div>
    );
}