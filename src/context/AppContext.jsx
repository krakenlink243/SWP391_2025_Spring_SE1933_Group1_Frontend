import { createContext, useContext, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { isTokenExpired } from '../utils/validators';
import socketService from '../services/SocketService';
import axios from 'axios';

export const AppContext = createContext({
    notification: [],
    walletBallance: 0,
    onlineUsers: []
})

export function AppProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const CUR_TOKEN = localStorage.getItem('token');

    useEffect(() => {
        if (!CUR_TOKEN || !isTokenExpired())
            return;

        socketService.connect(token);

        // Initial User wallet balance
        axios.get(`${import.meta.env.VITE_API_URL}/user/wallet`)
            .then((response) => { setNotifications(response.data) })
            .catch((error) => { console.log("Error fetching account balance: ", error) });

        axios.get()

        socketService.subscribe('/user/queue/notification.notread', data => {
            if (Array.isArray(data)) {
                // initial full list
                setNotifications(data);
            } else {
                // single new notification
                setNotifications(prev => [data, ...prev]);
            }
        })

        socketService.subscribe('/user/queue/wallet.balance', data => {
            setWalletBalance(data);
        })

        // Nhận online list ban đầu
        socketService.subscribe('/app/online', (data) => {
            setOnlineUsers(data);
        });

        // Nhận cập nhật online theo thời gian thực
        socketService.subscribe('/topic/online', (data) => {
            setOnlineUsers(data);
        });

        return () => {
            socketService.unsubscribe('/user/queue/notification.all');
            socketService.unsubscribe('/user/queue/wallet.balance');
            socketService.unsubscribe('/app/online');
            socketService.unsubscribe('/topic/online');
        };
    }, [token]);


    return (
        <AppContext.Provider value={{ notifications, walletBalance, onlineUsers }}>
            {children}
        </AppContext.Provider>
    );
}