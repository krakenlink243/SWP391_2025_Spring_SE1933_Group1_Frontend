import { useEffect, useState } from "react";
import Split from "split.js";
import ChatBodyLeft from "./ChatBodyLeft";
import ChatBodyRight from "./ChatBodyRight";
import './ChatBody.css';

function ChatBody({ bodyH }) {

    const [curChat, setCurChat] = useState(null);

    useEffect(() => {

        const split = Split(['#left-pane', '#right-pane'], {
            sizes: [20, 80],
            minSize: 200,
            maxSize: [440, Infinity],
            gutterSize: 5,
            direction: 'horizontal',
        });

        return () => split.destroy()
    }, [])
    return (
        <div className="chat-main split d-flex flex-row p-0" style={{ height: `${bodyH}px` }}>
            <ChatBodyLeft
                setCurChat={setCurChat}
            />
            <ChatBodyRight
                curChat={curChat}
            />

        </div>
    );
}

export default ChatBody;