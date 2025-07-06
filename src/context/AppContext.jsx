import { createContext, useEffect, useState } from 'react';
import { isTokenExpired } from '../utils/validators';
import socketService from '../services/SocketService';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const AppContext = createContext({
    notification: [],
    walletBallance: 0,
    cartTotal: 0,
    onlineUsers: []
})

export function AppProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // const [CUR_TOKEN, setCUR_TOKEN] = useState(localStorage.getItem("token"));
    const { token: CUR_TOKEN } = useAuth();

    useEffect(() => {
        if (!CUR_TOKEN || isTokenExpired())
            return;

        socketService.connect(CUR_TOKEN, () => {
            // Initial User wallet balance
            axios.get(`${import.meta.env.VITE_API_URL}/user/wallet`)
                .then((response) => { setWalletBalance(response.data) })
                .catch((error) => { console.log("Error fetching account balance: ", error) });

            // Initial Notifications 
            axios.get(`${import.meta.env.VITE_API_URL}/notification/list`)
                .then((response) => { setNotifications(response.data) })
                .catch((err) => { console.log("Error initial Notifications: ", err) });


            axios.get(`${import.meta.env.VITE_API_URL}/user/cart/total`)
                .then((response) => { setCartTotal(response.data.data) })
                .catch((err) => { console.log("Error intial Cart total: ", err) });



            socketService.subscribe('/user/queue/notification.unread', data => {
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

            // Đăng ký kênh nhận tổng số Item trong Cart nếu có add thêm
            socketService.subscribe('/user/queue/cart.count', (data) => {
                console.log("New cart count:", data, "Old:", cartTotal);
                setCartTotal(data);
            });
        });



        return () => {
            socketService.unsubscribe('/user/queue/notification.all');
            socketService.unsubscribe('/user/queue/wallet.balance');
            socketService.unsubscribe('/app/online');
            socketService.unsubscribe('/topic/online');
            socketService.unsubscribe('/queue/cart.count');
        };
    }, [CUR_TOKEN]);


    return (
        <AppContext.Provider value={{ notifications, walletBalance, cartTotal, onlineUsers }}>
            {children}
        </AppContext.Provider>
    );
}