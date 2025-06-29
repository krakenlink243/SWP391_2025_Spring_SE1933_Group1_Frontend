
function DetailSystem({ game }) {
    return (
        <div className="game-detail-system-container my-3">
            <h2>SYSTEM REQUIREMENTS</h2>
            <div className="line-seperate w-100"></div>
            <div className="system-content d-flex flex-row align-items-start">
                <div className="minimum-section">
                    <div className="req-row">
                        <h3>MINIMUM:</h3>
                    </div>
                    <div className="req-row">
                        <strong>OS:</strong> <span>{game.os || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>Processor:</strong> <span>{game.processor || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>Memory:</strong> <span>{game.memory || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>Graphics:</strong> <span>{game.graphics || "N/A"}</span>
                    </div>
                    <div className="req-row">
                        <strong>Storage:</strong> <span>{game.storage || "N/A"}</span>
                    </div>
                    {game.additionalNotes && (
                        <div className="req-row">
                            <strong>Additional Notes:</strong>{" "}
                            <span>{game.additionalNotes}</span>
                        </div>
                    )}
                </div>
                <div className="recommend-section">
                    <div className="req-row">
                        <h3>RECOMMENDED:</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DetailSystem;