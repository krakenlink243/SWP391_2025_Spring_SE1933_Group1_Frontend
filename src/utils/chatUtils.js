export function prepareChatHistory(messages, membersLookup) {

  if (!messages?.length) return [];

  // 1. sort by sentAt
  const sorted = [...messages].sort(
    (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
  );

  // 2. bucket by ISO day
  const byDay = sorted.reduce((acc, msg) => {
    const dayKey = new Date(msg.sentAt).toISOString().slice(0, 10);
    (acc[dayKey] = acc[dayKey] || []).push(msg);
    return acc;
  }, {});

  // 3. group within each day
  return Object.entries(byDay).map(([day, msgs]) => {
    const groups = [];
    msgs.forEach((msg) => {
      const last = groups[groups.length - 1];
      const ts = new Date(msg.sentAt).getTime();

      if (
        last &&
        last.senderId === msg.senderId &&
        ts - new Date(last.lastSent).getTime() < 5 * 60 * 1000
      ) {
        // continue the group
        last.messages.push({
          content: msg.messageContent,
          sentAt: msg.sentAt,
        });
        last.lastSent = msg.sentAt;
      } else {
        // start new group
        groups.push({
          senderId: msg.senderId,
          senderName:
            membersLookup[msg.senderId]?.username || msg.senderName,
          senderAvatarUrl:
            membersLookup[msg.senderId]?.avatarUrl || '',
          groupTimestamp: msg.sentAt,
          messages: [{ content: msg.messageContent, sentAt: msg.sentAt }],
          lastSent: msg.sentAt,
        });
      }
    });
    // remove helper
    groups.forEach((g) => delete g.lastSent);
    return { day, groups };
  });
}

// Formats "HH:mm Weekday, DD/MM/YYYY"
export const formatGroupTimestamp = (isoDate) => {
  const locale = 'vi-VN';
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };
  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const d = new Date(isoDate);
  return `${d.toLocaleTimeString(locale, timeOptions)} ${d.toLocaleDateString(
    locale,
    dateOptions
  )}`;
};