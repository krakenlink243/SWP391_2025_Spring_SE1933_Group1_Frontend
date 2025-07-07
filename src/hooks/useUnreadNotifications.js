import { useEffect, useState } from "react";
import SocketService from "../services/SocketService";
import { isTokenExpired } from "../utils/validators";
import axios from "axios";

export function useUnreadNotifications(token) {
    const [unread, setUnread] = useState([]);
    const channel = `user/queue/notification.unread`;

    useEffect(() => {
        if (!token || isTokenExpired()) return;

        axios.get(`${import.meta.env.VITE_API_URL}/notification/list/unread`)
            .then((response) => {
                setUnread(response.data);
            })
            .catch((err) => {
                console.error("Error fetching notifications:", err);
            });

        SocketService.connect(token)
            .then(() => {

                SocketService.subscribe(channel, (data) => {
                    setUnread(prev => [data, ...prev]);
                });

            })
            .catch((err) => {
                console.log("Error socket [Unread Notif socket]: ", err);
            });
        return () => SocketService.unsubscribe(channel);
    }, [token]);

    return unread;
}