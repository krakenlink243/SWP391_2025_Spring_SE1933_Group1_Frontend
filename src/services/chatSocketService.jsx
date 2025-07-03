import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscribed = false;

export const connectSocket = (onMessageReceived) => {
  const token = localStorage.getItem("token");
  if (stompClient && stompClient.connected && subscribed) return;
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws-community?token=${token}`),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      stompClient.subscribe('/user/queue/messages', (frame) => {
        const msg = JSON.parse(frame.body);
        onMessageReceived(msg);
      });
    },
    onStompError: (err) => {
      console.error('❌ STOMP error:', err);
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
  }
};

export const sendMessage = (conversationId, sender, receiver, content) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('⚠️ WebSocket is not connected yet.');
    return;
  }

  stompClient.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ conversationId: conversationId, senderUsername: sender, receiverUsername: receiver, content: content }),
  });
};

