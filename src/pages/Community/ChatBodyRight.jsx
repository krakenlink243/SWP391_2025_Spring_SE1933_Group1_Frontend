import { sendMessage, connectSocket } from "../../services/chatSocketService";
import { useEffect, useState, useRef } from "react";
function ChatBodyRight() {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const didConnectRef = useRef(false);

    useEffect(() => {
        if (didConnectRef.current) return;
        didConnectRef.current = true;

        connectSocket((message) => {
            setMessages(prev => [...prev, message]);
        });

        // Optional cleanup
        return () => {
            didConnectRef.current = false;
        };
    }, []);

    const handleSend = () => {
        if (input.trim() === "") return;
        console.log(targetUser);
        sendMessage(currentUser, targetUser, input);
        setMessages(prev => [...prev, { senderUsername: currentUser, content: input }]);
        setInput("");
    };

    const currentUser = localStorage.getItem("username");
    const [targetUser, setTargetUser] = useState(currentUser === "Minikie" ? "Lol" : "Minikie");


    return (
        // <div id="right-pane" className="multi-chat-dialog d-flex flex-column bg-success">
        //     <div className="chat-tab" style={{ height: "5%" }}>

        //     </div>
        //     <div className="chat-history-scroll" style={{ height: "85%" }}>

        //     </div>
        //     <div className="chat-entry d-flex flex-row" style={{ height: "10%" }}>
        //         <div className="chat-entry-control" style={{ width: "85%" }}>

        //         </div>
        //         <div className="chat-entry-actions" style={{ width: "15%" }}>

        //         </div>
        //     </div>
        // </div>
        <div id="right-pane" className="multi-chat-dialog d-flex flex-column bg-success" style={{ height: "100%", padding: "10px" }}>
            <div className="chat-history-scroll" style={{ flex: 1, overflowY: "auto", background: "white" }}>
                {console.log(messages)}
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ padding: "5px", color: msg.senderUsername === currentUser ? "blue" : "black" }}>
                        <strong>{msg.senderUsername}: </strong> {msg.content}
                    </div>
                ))}
            </div>

            <div className="chat-entry d-flex flex-row mt-2" style={{ gap: "5px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // tránh xuống dòng nếu là textarea
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    className="form-control"
                    style={{ flex: 1 }}
                />

                <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
export default ChatBodyRight;