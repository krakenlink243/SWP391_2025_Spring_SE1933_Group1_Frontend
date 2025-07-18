import { createContext, useEffect, useState } from 'react';
import { isTokenExpired } from '../utils/validators';
import SocketService from '../services/SocketService';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const AppContext = createContext({
    notification: [],
    walletBallance: 0,
    cartTotal: 0,
    onlineUsers: [],
    friendList: [],
    groupChats: []
})

export function AppProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [library, setLibrary] = useState([]);
    const [libraryLoading, setLibraryLoading] = useState(true);

    const [friendList, setFriendList] = useState([]);
    const [groupChats, setGroupChats] = useState([]);

    // const [CUR_TOKEN, setCUR_TOKEN] = useState(localStorage.getItem("token"));
    const { token: CUR_TOKEN } = useAuth();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!CUR_TOKEN || isTokenExpired())
            return;

        SocketService.connect(CUR_TOKEN, () => {
            // Initial User wallet balance
            axios.get(`${import.meta.env.VITE_API_URL}/user/wallet`)
                .then((response) => { setWalletBalance(response.data) })
                .catch((error) => { console.log("Error fetching account balance: ", error) });

            // Initial Notifications 
            axios.get(`${import.meta.env.VITE_API_URL}/notification/list`)
                .then((response) => { setNotifications(response.data) })
                .catch((err) => { console.log("Error initial Notifications: ", err) });

            // Initial Cart Total
            axios.get(`${import.meta.env.VITE_API_URL}/user/cart/total`)
                .then((response) => { setCartTotal(response.data.data) })
                .catch((err) => { console.log("Error intial Cart total: ", err) });

            // Initial Library
            axios.get(`${import.meta.env.VITE_API_URL}/user/library`)
                .then((response) => {
                    const mapped = (response.data.content || []).map((item) => ({
                        ...item.gameDetail,
                        playtimeInMillis: item.playtimeInMillis,
                    }));
                    setLibrary(mapped);
                })
                .catch((error) => { console.log("Error fetching library:", error) })
                .finally(() => {
                    setLibraryLoading(false);
                })

            // Initial Friends
            axios.get(`${import.meta.env.VITE_API_URL}/user/friends`)
                .then(r => setFriendList(r.data))
                .catch(console.error);

            // Initial GroupChats
            axios.get(`${import.meta.env.VITE_API_URL}/user/groupchat`)
                .then(r => setGroupChats(r.data.data))
                .catch(console.error);

            // --- Subscribe realtime friend events ---
            SocketService.subscribe(
                `/topic/friends.${userId}.added`,
                newFriend => setFriendList(prev => [...prev, newFriend])
            );

            SocketService.subscribe(
                `/topic/friends.${userId}.removed`,
                removedId => {

                    console.log("Removed friend:", removedId);
                    setFriendList(prev => prev.filter(f => f.friendId !== removedId));
                }
            );

            // --- Subscribe realtime group events ---
            SocketService.subscribe(
                `/topic/groups.${userId}.added`,
                newGroup => setGroupChats(prev => [...prev, newGroup])
            );
            SocketService.subscribe(
                `/topic/groups.${userId}.removed`,
                removedGroupId => setGroupChats(prev => prev.filter(g => g.groupId !== removedGroupId))
            );


            SocketService.subscribe('/user/queue/notification.unread', data => {
                if (Array.isArray(data)) {
                    // initial full list
                    setNotifications(data);
                } else {
                    // single new notification
                    setNotifications(prev => [data, ...prev]);
                }
            })

            SocketService.subscribe('/user/queue/wallet.balance', data => {
                setWalletBalance(data);
            })

            // Nhận online list ban đầu
            SocketService.subscribe('/app/online', (data) => {
                setOnlineUsers(data);
            });

            // Nhận cập nhật online theo thời gian thực
            SocketService.subscribe('/topic/online', (data) => {
                setOnlineUsers(data);
            });

            // Đăng ký kênh nhận tổng số Item trong Cart nếu có add thêm
            SocketService.subscribe('/user/queue/cart.count', (data) => {
                setCartTotal(data);
            });

            SocketService.subscribe('/user/queue/libraryItem.added', (newGame) => {
                // map the DTO into the same shape your old .get() handler used:
                const mapped = {
                    ...newGame.gameDetail,
                    playtimeInMillis: newGame.playtimeInMillis
                };

                setLibrary(prev => {
                    // avoid duplicates
                    if (prev.some(g => g.gameId === mapped.gameId)) {
                        return prev;
                    }
                    return [...prev, mapped];
                });
            });
        });



        return () => {
            SocketService.unsubscribe('/user/queue/notification.all');
            SocketService.unsubscribe('/user/queue/wallet.balance');
            SocketService.unsubscribe('/app/online');
            SocketService.unsubscribe('/topic/online');
            SocketService.unsubscribe('/queue/cart.count');
            SocketService.unsubscribe('/user/queue/library.added');
            // Unsubscribe friend & group channels
            SocketService.unsubscribe(`/topic/friends/${userId}/added`);
            SocketService.unsubscribe(`/topic/friends/${userId}/removed`);
            SocketService.unsubscribe(`/topic/groups/${userId}/added`);
            SocketService.unsubscribe(`/topic/groups/${userId}/removed`);
        };
    }, [CUR_TOKEN]);


    return (
        <AppContext.Provider
            value={{
                notifications,
                walletBalance,
                cartTotal,
                onlineUsers,
                library,
                libraryLoading,
                friendList,
                groupChats
            }}>
            {children}
        </AppContext.Provider>
    );
}