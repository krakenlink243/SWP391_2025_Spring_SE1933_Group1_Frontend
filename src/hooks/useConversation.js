import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SocketService from '../services/SocketService';

export function useConversation(token, curChat) {
  const [conversation, setConversation] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  // <-- ref to hold the active subscription
  const subscriptionRef = useRef(null);
  const groupJoinRef = useRef(null);
  const groupLeaveRef = useRef(null);

  useEffect(() => {
    if (!token || !curChat) return;

    // 1) Unsubscribe from previous chat (if any)
    if (subscriptionRef.current != null) {
      SocketService.unsubscribe(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // 2) Fetch history
    if (curChat.type === 'friend') {
      axios.get(`${import.meta.env.VITE_API_URL}/user/conversation/${curChat.id}`)
        .then(resp => {
          setConversation(resp.data);
          setMessages(resp.data.messages || []);
        });
    } else {
      axios.get(`${import.meta.env.VITE_API_URL}/user/groupchat/${curChat.id}`)
        .then(resp => {
          setMembers(resp.data.data.members || []);
          setMessages(resp.data.data.messages || []);
        });
    }

    // 3) Subscribe to new chat
    const topic = curChat.type === 'friend'
      ? `/user/queue/messages/${curChat.name}`
      : `/topic/group/${curChat.id}/messages`;

    subscriptionRef.current = topic;
    SocketService.subscribe(topic, msg => {
      setMessages(prev => [...prev, msg]);
    });

    // 3.1) Subscribe to group event 
    if (curChat.type === 'group') {
      const joinTopic = `/topic/group.${curChat.id}.join`;
      const leaveTopic = `/topic/group.${curChat.id}.leave`;

      groupJoinRef.current = joinTopic;
      groupLeaveRef.current = leaveTopic;

      SocketService.subscribe(joinTopic, newMember => {
        setMembers(prev => [...prev, newMember]);
      });

      SocketService.subscribe(leaveTopic, leaverId => {
        setMembers(prev => prev.filter(member => member.memberId !== leaverId));
      });
    }

    // 4) Cleanup when curChat or token changes (or on unmount)
    return () => {
      if (subscriptionRef.current) {
        SocketService.unsubscribe(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      if (groupJoinRef.current) {
        SocketService.unsubscribe(groupJoinRef.current);
        groupJoinRef.current = null;
      }
      if (groupLeaveRef.current) {
        SocketService.unsubscribe(groupLeaveRef.current);
        groupLeaveRef.current = null;
      }
      // reset state
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
        senderId: localStorage.getItem('userId'),
        receiverUsername: curChat.name,
        content,
      });
    } else {
      SocketService.publish('/app/chat/group.send', {
        groupId: curChat.id,
        senderId: localStorage.getItem('userId'),
        content,
      });
    }
  };
  return { conversation, members, messages, sendMessages };
}
