import { useState } from "react";
import GameApprovePage from "./GameApprovePage";
import PublisherApprovePage from "./PublisherApprovePage";
import FeedbackApprovePage from "./FeedbackApprovePage";


export default function RequestSection() {

    const [curTab, setCurTab] = useState(0);
    const [fadeClass, setFadeClass] = useState("fade-in");

    const tabs = [
        <GameApprovePage />,
        <PublisherApprovePage />,
        <FeedbackApprovePage />
    ];


    const handleChangeTab = (indx) => {
        setFadeClass("fade-out");

        setTimeout(() => {
            setCurTab(indx);
            setFadeClass("fade-in");
        }, 300);
    };

    return (
        <div className="request-section">
            <div className="request-section-nav d-flex flex-row w-100 h-100">
                <div
                    className={`nav-item${curTab === 0 ? " active" : ""}`}
                    onClick={() => handleChangeTab(0)}
                >
                    Game Request
                </div>
                <div
                    className={`nav-item${curTab === 1 ? " active" : ""}`}
                    onClick={() => handleChangeTab(1)}
                >
                    Publisher Request
                </div>
                <div
                    className={`nav-item${curTab === 2 ? " active" : ""}`}
                    onClick={() => handleChangeTab(2)}
                >
                    Feedback
                </div>
            </div>
            <div className={`request-section-body ${fadeClass}`}>
                {tabs[curTab]}
            </div>
        </div>
    );
}