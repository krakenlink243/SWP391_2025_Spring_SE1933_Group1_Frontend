export function prepareChatHistory(pastMessages, liveMessages) {
  // 1) Merge and normalize to a common shape
  const all = [
    ...pastMessages.map(m => ({
      rawTs: m.createAt,
      senderKey: m.senderName,        // normalize to string
      senderName: m.senderName,       // or map ID→username if you have it
      content: m.messageContent,
    })),
    ...liveMessages.map(m => ({
      rawTs: m.sentAt,
      senderKey: m.senderUsername,
      senderName: m.senderUsername,
      content: m.content,
    }))
  ];

  // 2) Sort by timestamp
  all.sort((a, b) => new Date(a.rawTs) - new Date(b.rawTs));

  const days = [];

  // 3) Group by day & by consecutive same-sender
  all.forEach(item => {
    // a) Parse into a Date object
    const dateObj = item.rawTs instanceof Date
      ? item.rawTs
      : new Date(item.rawTs);

    // b) Skip invalid dates
    if (isNaN(dateObj.getTime())) {
      console.warn("Skipping invalid timestamp:", item.rawTs);
      return;
    }

    // c) Get a single ISO string
    const iso = dateObj.toISOString();            // e.g. "2025-06-25T22:59:03.548Z"
    const day  = iso.slice(0, 10);                // "2025-06-25"
    const time = iso.slice(11, 16);               // "22:59"

    // d) Find or create the day bucket
    let bucket = days.find(d => d.day === day);
    if (!bucket) {
      bucket = { day, groups: [] };
      days.push(bucket);
    }

    // e) Group into bubbles by same senderKey
    const lastGroup = bucket.groups[bucket.groups.length - 1];
    if (lastGroup && lastGroup.senderKey === item.senderKey) {
      lastGroup.messages.push({ content: item.content, time });
    } else {
      bucket.groups.push({
        senderKey:  item.senderKey,
        senderName: item.senderName,
        messages:   [{ content: item.content, time }]
      });
    }
  });

  return days;
}
