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
            reconnectDelay: 300,

        });

        client.onConnect = () => {
            console.log("Connect to Socket Online User")

            client.subscribe("/app/online", (frame) => {
                setOnlineUsers(JSON.parse(frame.body));
            });

            client.subscribe("/topic/online", (frame) => {
                console.log("[Socket] Received /topic/online:", frame.body); // DEBUG
                setOnlineUsers(JSON.parse(frame.body));
            });

            client.publish({ destination: "/app/online" });
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