import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


class SocketService {
    constructor() {
        this.client = null;
        this.subscriptions = {};
    }

    connect(token) {
        if (this.client?.connected) return;

        this.client = new Client({
            webSocketFactory: () =>
                new SockJS(`${import.meta.env.VITE_API_URL}/ws-community?token=${token}`),
            reconnectDelay: 5000,
            onConnect: () => console.log('Socket connected'),
        });

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (!this.client) throw new Error('Not connected');

        if (!this.subscriptions[topic]) {
            this.subscriptions[topic] = this.client.subscribe(topic, frame =>
                callback(JSON.parse(frame.body))
            );
        }
    }

    unsubscribe(topic) {
        this.subscriptions[topic]?.unsubscribe();
        delete this.subscriptions[topic];
    }

    disconnect() {
        this.client?.deactivate();
        this.client = null;
        this.subscriptions = {};
    }
}

export default new SocketService();