import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscribed = false;

export const connectSocket = (onMessageReceived) => {
  const token = localStorage.getItem("token");
  if (stompClient && stompClient.connected && subscribed) return;
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`http://localhost:8080/ws-chat?token=${token}`),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    connectHeaders: {
      token: token  // or however you store it
    },
    onConnect: () => {
      console.log('🔌 Connected to WebSocket', stompClient.connected);
      if (!subscribed) {

        stompClient.subscribe('/user/queue/messages', (frame) => {
          console.log("Received message: ", frame.body);
          console.log('sub #', Math.random().toFixed(3), 'got', frame.body);
          const msg = JSON.parse(frame.body);
          onMessageReceived(msg);
        });
        subscribed = true;

      }
    },
    onStompError: (err) => {
      console.error('❌ STOMP error:', err);
    },
  });

  stompClient.activate();
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

