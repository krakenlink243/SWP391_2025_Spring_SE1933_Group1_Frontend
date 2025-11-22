import { useEffect, useState } from "react";
import SocketService from "../services/SocketService";
import { isTokenExpired } from "../utils/validators";
import axios from "axios";

export function useFriendInvite(token) {
    const [sentInvites, setSentInvites] = useState([]);
    const [receivedInvites, setReceivedInvites] = useState([]);
    const channel = '/user/queue/friend.invitations';
    const maintainChannel = [
        "/user/queue/friend.request.b1",
        "/user/queue/friend.request.b2"
    ]

    useEffect(() => {
        if (!token || isTokenExpired()) return;

        const fetchInvites = async () => {
            try {
                const [receivedRes, sentRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/user/pendinginvite/receive`),
                    axios.get(`${import.meta.env.VITE_API_URL}/user/pendinginvite/init`)
                ]);
                setReceivedInvites(receivedRes.data.data);
                setSentInvites(sentRes.data.data);
            } catch (err) {
                console.error("Failed to fetch invites:", err);
            }
        };

        SocketService.connect((token), () => {
            SocketService.subscribe(channel, (data) => {
                setReceivedInvites(prev => {
                    const exists = prev.some(inv => inv.invitorId === data.invitorId);
                    return exists ? prev : [data, ...prev];
                })
            })


            SocketService.subscribe(maintainChannel[0], (receiverId) => {
                setSentInvites(prev => prev.filter(inv => inv.receiverId !== receiverId));

            })

            SocketService.subscribe(maintainChannel[1], (senderId) => {
                setReceivedInvites(prev => prev.filter(inv => inv.senderId !== senderId));

            })

        })
        fetchInvites();

        return () => {
            SocketService.unsubscribe(channel);
            SocketService.unsubscribe(maintainChannel[0]);
            SocketService.unsubscribe(maintainChannel[1]);
        };
    }, [token]);

    return {
        sentInvites,
        receivedInvites,
        setSentInvites,
        setReceivedInvites
    };
}