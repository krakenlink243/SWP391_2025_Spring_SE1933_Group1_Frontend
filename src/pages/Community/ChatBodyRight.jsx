function ChatBodyRight() {
    return (
        <div id="right-pane" className="multi-chat-dialog d-flex flex-column bg-success">
            <div className="chat-tab" style={{ height: "5%" }}>

            </div>
            <div className="chat-history-scroll" style={{ height: "85%" }}>

            </div>
            <div className="chat-entry d-flex flex-row" style={{ height: "10%" }}>
                <div className="chat-entry-control" style={{ width: "85%" }}>

                </div>
                <div className="chat-entry-actions" style={{ width: "15%" }}>

                </div>
            </div>
        </div>
    );
}
export default ChatBodyRight;