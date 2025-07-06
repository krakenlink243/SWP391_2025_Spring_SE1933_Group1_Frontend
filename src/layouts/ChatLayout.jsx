import { Outlet } from "react-router-dom";

export default function ChatLayout() {
    return (
        <div className="chat-layout">
            {/* Custom layout if needed */}
            <Outlet />
        </div>
    );
}
