import { useEffect, useState } from "react";
import { isTokenExpired } from "../utils/validators";
import SocketService from "../services/SocketService";
import axios from "axios";

export function useGroupChat(token, groupId) {
    const [messages, setMessages] = useState([]);
    

    useEffect(() => {
        if (!token || isTokenExpired() || !groupId) return;

        const channel = `/topic/group/${groupId}/messages`;

        let mounted = true;

        setMessages([]);

        axios.get(`${import.meta.env.VITE_API_URL}/user/groupchat/${groupId}`)
            .then((resp) => {
                setMessages(resp.data.data.messages || []);
            })
            .catch((err) => { console.log("Error load conversation: " + err) })


        SocketService.connect(token, () => {
            if (!mounted) return;
            SocketService.subscribe(channel, msg => {
                setMessages(prev => [...prev, msg]);
            });
        }).catch(console.error);

        return () => {
            mounted = false;
            SocketService.unsubscribe(channel);
        };

    }, [token, groupId])

    const sendMessages = (senderId, content) => {
        SocketService.publish(`/app/group/${groupId}.send`, {
            senderId: senderId,
            content: content
        })

    }

    return { messages, sendMessages };

}
