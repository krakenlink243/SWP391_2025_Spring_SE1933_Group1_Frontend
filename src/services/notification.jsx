import axios from "axios"
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/validators";

/**
 * @author Phan NT Son
 * @description Tạo thông báo khi người dùng thêm game vào giỏ hàng
 * @param {*} receiverId - ID of the user receiving the notification
 */
export const createNotification = async (receiverId, type, message) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/notification/create`,
            {
                receiverId: receiverId,
                notificationType: type,
                notificationContent: message,
            }
        );
        console.log("Notification created:", response.data);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

const NotificationContext = createContext([]);

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState([]);
    const token = localStorage.getItem("token");



    useEffect(() => {
        if (!token || isTokenExpired()) {
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws-community?token=${token}`),
            reconnectDelay: 300,

        });

        client.onConnect = () => {
            console.log("Connect to Socket Notification")

            client.subscribe("/user/queue/notification.all", (frame) => {
                const body = JSON.parse(frame.body);
                if (Array.isArray(body)) {
                    // initial full list
                    console.log("Notif body: ", body);
                    setNotification(body);
                } else {
                    // single new notification
                    console.log("Notif body: ", body);
                    setNotification(prev => [body, ...prev]);
                }
            });

        };


        client.activate();
        return () => { client.deactivate(); };
    }, [token]);

    return (
        <NotificationContext.Provider value={notification}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}