import { useTranslation } from "react-i18next"; // Thêm useTranslation


function DetailSystem({ game }) {
    const { t } = useTranslation(); // Thêm hook useTranslation
    return (
        <div className="game-detail-system-container my-3">
            <h2>{t("SYSTEM REQUIREMENTS")}</h2>
            <div className="line-seperate w-100"></div>
            <div className="system-content d-flex flex-row align-items-start">
                <div className="minimum-section">
                    <div className="req-row">
                        <h3>{t("MINIMUM")}:</h3>
                    </div>
                    <div className="req-row">
                        <strong>{t("OS")}:</strong> <span>{game.os || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>{t("Processor")}:</strong> <span>{game.processor || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>{t("Memory")}:</strong> <span>{game.memory || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>{t("Graphics")}:</strong> <span>{game.graphics || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>{t("Storage")}:</strong> <span>{game.storage || "N/A"}</span>
                    </div>
                    {game.additionalNotes && (
                        <div className="req-row">
                            <strong>{t("Additional Notes")}:</strong>{" "}
                            <span>{game.additionalNotes}</span>
                        </div>
                    )}
                </div>
                <div className="recommend-section">
                    <div className="req-row">
                        {/* <h3>{t("RECOMMENDED")}:</h3> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DetailSystem;