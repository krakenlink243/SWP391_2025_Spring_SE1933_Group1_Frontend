import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { isTokenExpired } from '../utils/validators';

class SocketService {
    constructor() {
        this.client = null;
        this.subscriptions = {};
    }

    connect(token, onConnected) {
        return new Promise((resolve, reject) => {
            if (!token || isTokenExpired()) return reject(new Error("Token is null or expired"));

            if (this.client?.connected) {
                onConnected?.();
                return resolve();
            };

            this.client = new Client({
                webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws-community?token=${token}`),
                reconnectDelay: 5000,
                onConnect: () => {
                    setTimeout(() => {
                        onConnected?.();
                    }, 500);

                    resolve();
                },
                onStompError: (frame) => {
                    console.error("STOMP Error:", frame);
                    reject(new Error("Failed to connect WebSocket"));
                }
            });

            this.client.activate();
        });
    }

    subscribe(topic, callback) {
        if (!this.client) throw new Error('Not connected');

        try {
            if (!this.subscriptions[topic]) {
                // console.log(`[SocketService] Subscribing to ${topic}`);
                this.subscriptions[topic] = this.client.subscribe(topic, frame =>
                    callback(JSON.parse(frame.body))
                );
            }
        } catch (error) {
            console.error(`[SocketService] Failed to subscribe to ${topic}:`, error);
        }
    }

    unsubscribe(topic) {
        this.subscriptions[topic]?.unsubscribe();
        // console.log(`[SocketService] Unsubscribing to ${topic}`);
        delete this.subscriptions[topic];
    }

    disconnect() {
        this.client?.deactivate();
        this.client = null;
        this.subscriptions = {};
    }

    publish(destination, payload) {
        if (!this.client || !this.client.connected) {
            console.warn('[Chat] Websocket is not connected yet.');
        }

        this.client.publish({
            destination,
            body: JSON.stringify(payload)
        });
    }
}

export default new SocketService();