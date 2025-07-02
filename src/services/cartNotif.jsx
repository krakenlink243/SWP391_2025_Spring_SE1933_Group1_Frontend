import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * @author Phan NT Son
 * @since 28-06-2025
 * 
 * @param {*} onNotifReceived of Cart total items in it - it's a Number
 * @returns 
 */
let stompClient = null;
let subscribed = false;
export const connectSocketNotif = (onNotifReceived) => {
    const token = localStorage.getItem("token");
    if (stompClient && stompClient.connected && subscribed) return;
    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws-community?token=${token}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            if (!subscribed) {
                stompClient.subscribe('/user/queue/notification.cart', (frame) => {
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