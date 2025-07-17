export function prepareChatHistory(pastMessages, liveMessages) {
  const MAX_GAP_MINUTES = 5;

  // 1. Merge và chuẩn hóa dữ liệu
  const all = [
    ...pastMessages.map(m => ({
      rawTs: m.createAt,
      senderKey: m.senderName,
      senderName: m.senderName,
      content: m.messageContent,
    })),
    ...liveMessages.map(m => ({
      rawTs: m.sentAt,
      senderKey: m.senderUsername,
      senderName: m.senderUsername,
      content: m.content,
    }))
  ];

  // 2. Sắp xếp theo thời gian
  all.sort((a, b) => new Date(a.rawTs) - new Date(b.rawTs));

  const days = [];
  const dayMap = {}; // để truy cập nhanh hơn

  // 3. Gom theo ngày + người gửi + khoảng cách thời gian
  for (let msg of all) {
    const ts = new Date(msg.rawTs);
    if (isNaN(ts.getTime())) {
      console.warn("Invalid timestamp:", msg.rawTs);
      continue;
    }

    const dayKey = ts.toLocaleDateString('vi-VN'); // ví dụ: "8/7/2025"
    let dayBlock = dayMap[dayKey];
    if (!dayBlock) {
      dayBlock = { day: dayKey, groups: [] };
      dayMap[dayKey] = dayBlock;
      days.push(dayBlock);
    }

    const lastGroup = dayBlock.groups[dayBlock.groups.length - 1];

    const isSameSender = lastGroup && lastGroup.senderKey === msg.senderKey;
    const timeGapOK = lastGroup
      ? (ts - lastGroup.lastMsgTime) / 60000 <= MAX_GAP_MINUTES
      : false;

    if (isSameSender && timeGapOK) {
      // Tiếp tục nhóm hiện tại
      lastGroup.messages.push({ content: msg.content });
      lastGroup.lastMsgTime = ts; // cập nhật thời gian cuối cùng
    } else {
      // Bắt đầu nhóm mới
      dayBlock.groups.push({
        senderKey: msg.senderKey,
        senderName: msg.senderName,
        groupTimestamp: ts,
        lastMsgTime: ts,
        messages: [{ content: msg.content }]
      });
    }
  }

  return days;
}
