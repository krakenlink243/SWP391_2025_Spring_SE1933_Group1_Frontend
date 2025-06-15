function DetailBody({game}) {
    return (
        <div className="game-detail-body-container">
            <h2>ABOUT THIS GAME</h2>
            {/* Dùng dangerouslySetInnerHTML để render HTML nếu có, hoặc đơn giản là <p> */}
            <div
                className="description-body"
                dangerouslySetInnerHTML={{
                    __html: game.fullDescription.replace(/\n/g, "<br />"),
                }}
            />
        </div>

    );
}

export default DetailBody;