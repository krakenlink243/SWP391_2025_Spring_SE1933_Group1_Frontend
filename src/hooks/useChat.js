import { useEffect, useState } from "react";
import { isTokenExpired } from "../utils/validators";
import SocketService from "../services/SocketService";
import axios from "axios";

export function useChat(token, friendId, friendName) {
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState();

    useEffect(() => {
        if (!token || isTokenExpired() || !friendId) return;

        const channel = `/user/queue/messages/${friendName}`;

        let mounted = true;

        setMessages([]);
        setConversation(undefined);

        axios.get(`${import.meta.env.VITE_API_URL}/user/conversation/${friendId}`)
            .then((resp) => {
                setConversation(resp.data);
                setMessages(resp.data.messages || []);
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

    }, [token, friendId])

    const sendMessages = (conversationId, senderId, receiverName, content) => {
        SocketService.publish("/app/chat/private.send", {
            conversationId: conversationId,
            senderId: senderId,
            receiverUsername: receiverName,
            content: content
        })

    }

    return { messages, conversation, sendMessages };

}
