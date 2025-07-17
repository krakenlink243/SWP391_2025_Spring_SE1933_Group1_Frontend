import { useState, useEffect } from 'react';
import axios from 'axios';
import SocketService from '../services/SocketService';

export function useConversation(token, curChat) {
  const [conversation, setConversation] = useState(null);
  const [members, setMembers]           = useState([]);
  const [messages, setMessages]         = useState([]);

  useEffect(() => {
    if (!token || !curChat) return;

    // keep track of the active subscription id
    let subscriptionId;

    // connect & subscribe
    SocketService.connect(token, () => {
      if (curChat.type === 'friend') {
        // 1) REST fetch private history
        axios.get(`${import.meta.env.VITE_API_URL}/user/conversation/${curChat.id}`)
          .then(resp => {
            setConversation(resp.data);
            setMessages(resp.data.messages || []);
          });

        // 2) STOMP subscribe
        subscriptionId = SocketService.subscribe(
          `/user/queue/messages/${curChat.name}`,
          msg => setMessages(prev => [...prev, msg])
        );

      } else {
        // 1) REST fetch group history + members
        axios.get(`${import.meta.env.VITE_API_URL}/user/groupchat/${curChat.id}`)
          .then(resp => {
            setMembers(resp.data.data.members || []);
            setMessages(resp.data.data.messages || []);
          });

        // 2) STOMP subscribe
        subscriptionId = SocketService.subscribe(
          `/topic/group/${curChat.id}/messages`,
          msg => setMessages(prev => [...prev, msg])
        );
      }
    });

    // cleanup: unsubscribe & disconnect if no more subscriptions
    return () => {
      if (subscriptionId != null) {
        SocketService.unsubscribe(subscriptionId);
      }
      // optionally disconnect if you want to fully tear down:
      // SocketService.disconnect();

      setMessages([]);
      setConversation(null);
      setMembers([]);
    };
  }, [token, curChat]);

  const sendMessages = (content) => {
    if (!curChat) return;
    if (curChat.type === 'friend') {
      SocketService.publish('/app/chat/private.send', {
        conversationId: conversation.conversationId,
        senderId:       localStorage.getItem('userId'),
        receiverUsername: curChat.name,
        content,
      });
    } else {
      SocketService.publish('/app/chat/group.send', {
        groupId:  curChat.id,
        senderId: localStorage.getItem('userId'),
        content,
      });
    }
  };

  return { conversation, members, messages, sendMessages };
}
