module.exports.config = {
  name: "هيه",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "ZINO - تطوير منتصر",
  description: "تغيير كنية جميع الأعضاء في المجموعة مع إمكانية الإيقاف",
  commandCategory: "خدمات",
  usages: "كنية [الرد بالكنية] أو كنية ايقاف",
  cooldowns: 5
};

// متغير لتتبع عمليات تغيير الكنية الجارية
global.nicknameProcesses = global.nicknameProcesses || new Map();

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  if (handleReply.author != senderID) return;

  const newNickname = body.trim();
  if (!newNickname) return api.sendMessage("⚠️ | الرجاء إدخال كنية صحيحة", threadID, messageID);

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;

  // تسجيل العملية الجديدة
  global.nicknameProcesses.set(threadID, {
    stop: false,
    completed: 0,
    remaining: participantIDs.length,
    nickname: newNickname,
    total: participantIDs.length
  });

  api.sendMessage(
    `⏳ | جاري تغيير كنية جميع الأعضاء...\n📝 | الكنية الجديدة: "${newNickname}"\n👥 | العدد الكلي: ${participantIDs.length} عضو\n\n💡 | استخدم "كنية ايقاف" لإيقاف العملية`,
    threadID, messageID
  );

  let success = 0;
  let failed = 0;

  for (let i = 0; i < participantIDs.length; i++) {
    const userID = participantIDs[i];

    // فحص إذا تم طلب الإيقاف
    const process = global.nicknameProcesses.get(threadID);
    if (process && process.stop) {
      api.sendMessage(
        `⏹️ | تم إيقاف العملية!\n\n` +
        `✅ | تم تغيير: ${success} عضو\n` +
        `❌ | فشل في تغيير: ${failed} عضو\n` +
        `⏸️ | متبقي: ${participantIDs.length - i} عضو`,
        threadID, messageID
      );
      global.nicknameProcesses.delete(threadID);
      return;
    }

    try {
      await api.changeNickname(newNickname, threadID, userID);
      success++;
    } catch {
      failed++;
    }

    // تحديث الإحصائيات
    if (process) {
      process.completed = success + failed;
      process.remaining = participantIDs.length - (success + failed);
    }

    // إرسال تحديث كل 10 أعضاء
    if ((success + failed) % 10 === 0 && (success + failed) < participantIDs.length) {
      api.sendMessage(
        `📊 | تقدم العملية: ${success + failed}/${participantIDs.length}\n✅ | نجح: ${success} | ❌ فشل: ${failed}`,
        threadID
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // إزالة العملية من التتبع عند الانتهاء
  global.nicknameProcesses.delete(threadID);

  return api.sendMessage(
    `✅ | تم تغيير الكنية بنجاح!\n\n` +
    `👥 | تم تغيير: ${success} عضو\n` +
    `❌ | فشل في تغيير: ${failed} عضو\n` +
    `📝 | الكنية: "${newNickname}"`,
    threadID, messageID
  );
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // إذا كان الأمر "ايقاف"
  if (args[0] === "ايقاف" || args[0] === "stop") {
    if (global.nicknameProcesses.has(threadID)) {
      global.nicknameProcesses.get(threadID).stop = true;
      return api.sendMessage("⏹️ | تم إيقاف عملية تغيير الكنيات", threadID, messageID);
    } else {
      return api.sendMessage("❌ | لا توجد عملية تغيير كنيات جارية حالياً", threadID, messageID);
    }
  }

  // إذا كان الأمر "حالة" لمعرفة حالة العملية
  if (args[0] === "حالة" || args[0] === "status") {
    if (global.nicknameProcesses.has(threadID)) {
      const process = global.nicknameProcesses.get(threadID);
      return api.sendMessage(
        `📊 | حالة تغيير الكنيات:\n• تم تغيير: ${process.completed} عضو\n• المتبقي: ${process.remaining} عضو\n• الكنية: ${process.nickname}`,
        threadID, messageID
      );
    } else {
      return api.sendMessage("❌ | لا توجد عملية تغيير كنيات جارية حالياً", threadID, messageID);
    }
  }

  return api.sendMessage(
    "💬 | قم بالرد على هذه الرسالة بالكنية التي تريد تعيينها لجميع الأعضاء\n\n📝 أوامر إضافية:\n• كنية ايقاف - لإيقاف العملية\n• كنية حالة - لمعرفة حالة العملية",
    threadID,
    (error, info) => {
      if (error) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    },
    messageID
  );
};