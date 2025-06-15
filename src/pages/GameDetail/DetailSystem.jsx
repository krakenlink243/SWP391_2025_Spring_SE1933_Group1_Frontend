function DetailSystem({game}) {
    return (
        <div className="game-detail-system-container">
            <h2>SYSTEM REQUIREMENTS</h2>
            <div className="requirements-grid">
                <strong>OS:</strong> <span>{game.os || "N/A"}</span>
                <strong>Processor:</strong> <span>{game.processor || "N/A"}</span>
                <strong>Memory:</strong> <span>{game.memory || "N/A"}</span>
                <strong>Graphics:</strong> <span>{game.graphics || "N/A"}</span>
                <strong>Storage:</strong> <span>{game.storage || "N/A"}</span>
                {game.additionalNotes && (
                    <>
                        <strong>Additional Notes:</strong>{" "}
                        <span>{game.additionalNotes}</span>
                    </>
                )}
            </div>
        </div>

    );
}
export default DetailSystem;