import { useEffect, useContext, useState, createContext } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const OnlineUsersContext = createContext([]);

export function OnlineUserProvider({ children }) {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const token = localStorage.getItem("token");



    useEffect(() => {
        if (!token) {
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-chat?token=${token}`),
            reconnectDelay: 5000,

        });

        client.onConnect = () => {
            console.log("Connect to Socket Online User")
            client.subscribe("/user/queue/online", (frame) => {
                setOnlineUsers(JSON.parse(frame.body));
            });
        };


        client.activate();
        return () => { client.deactivate(); };
    }, [token]);

    return (
        <OnlineUsersContext.Provider value={onlineUsers}>
            {children}
        </OnlineUsersContext.Provider>
    );
}

export function useOnlineUsers() {
    return useContext(OnlineUsersContext);
}