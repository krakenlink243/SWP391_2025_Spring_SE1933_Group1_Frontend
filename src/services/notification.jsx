import axios from "axios"
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * @author Phan NT Son
 * @description Tạo thông báo khi người dùng thêm game vào giỏ hàng
 * @param {*} receiverId - ID of the user receiving the notification
 */
export const createNotification = async (receiverId, type, message) => {
    try {
        const response = await axios.post(
            "http://localhost:8080/notification/create",
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

/**
 * @author Phan NT Son
 * @description Subscribe to notification channel via websocket and receive notification object
 * @returns {Promise<Object>} - The notification object received from the server
 */
let stompClient = null;
let subscribed = false;

export const connectSocketNotif = (onNotifReceived) => {
    const token = localStorage.getItem("token");
    if (stompClient && stompClient.connected && subscribed) return;
    stompClient = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:8080/ws-community?token=${token}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            if (!subscribed) {
                stompClient.subscribe('/user/queue/notifications', (frame) => {
                    const notif = JSON.parse(frame.body);
                    onNotifReceived(notif);
                }
                );
                subscribed = true;
            }

        },
        onStompError: (err) => {
            console.error('❌ STOMP error:', err);
        },
    });

    stompClient.activate();
};

export const disconnectSocketNotif = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate().then(() => {
            console.log("🛑 Socket disconnected");
            subscribed = false; // ✅ reset để lần sau có thể subscribe lại
        });

    } else {
        subscribed = false;
    }
};