import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import './ChatPage.css'


function ChatPage() {
    const token = localStorage.getItem("token")
    if (!token) {
        return <Navigate to={"/"} replace />
    } else {
        const headerH = useRef(null);
        const [bodyH, setBodyH] = useState(0);
        
        useEffect(() => {
            const calculateH = () => {
                const windowH = window.innerHeight;
                setBodyH(windowH - headerH.current.offsetHeight);
            };
            calculateH();
        }, [])

        return (
            <div className="container-fluid h-100">
                <div className="row">
                    <ChatHeader ref={headerH} />
                </div>

                <div className="row">
                    <ChatBody bodyH={bodyH} />
                </div>
            </div>
        );
    }

}

export default ChatPage;