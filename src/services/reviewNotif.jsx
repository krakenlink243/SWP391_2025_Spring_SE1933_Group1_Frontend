import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * @author Phan NT Son
 * @since 29-06-2025
 * 
 * @param {*} onNotifReceived of Cart total items in it - it's a Number
 * @returns 
 */
let stompClient = null;
let subscribed = false;
export const connectSocketReview = (gameId, onReviewReceived) => {
    const token = localStorage.getItem("token");

    if (!token || !gameId) {
        console.log("No token or gameId");
        return;
    }

    if (stompClient && stompClient.connected && subscribed) return;
    stompClient = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:8080/ws-community?token=${token}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            if (!subscribed) {
                stompClient.subscribe('/topic/review.' + gameId, (frame) => {
                    const review = JSON.parse(frame.body);
                    onReviewReceived(review);
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

export const disconnectSocketReview = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate().then(() => {
            console.log("🛑 Socket disconnected");
            subscribed = false; // ✅ reset để lần sau có thể subscribe lại
        });

    } else {
        subscribed = false;
    }
};