import { useEffect } from "react";
import Split from "split.js";
import ChatBodyLeft from "./ChatBodyLeft";
import ChatBodyRight from "./ChatBodyRight";

function ChatBody({ bodyH }) {

    useEffect(() => {
        
        Split(['#left-pane', '#right-pane'], {
            sizes: [20, 80],
            minSize: 200,
            maxSize: [440, Infinity],
            gutterSize: 5,
            direction: 'horizontal',
        });
    }, [])
    return (
        <div className="chat-main d-flex flex-row p-0" style={{ height: `${bodyH}px` }}>
            <ChatBodyLeft />
            <ChatBodyRight />

        </div>
    );
}

export default ChatBody;