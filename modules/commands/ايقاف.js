
const fs = require('fs');

module.exports.config = {
    name: "ايقاف",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Assistant",
    description: "إيقاف البوت عن الرد على المستخدمين العاديين",
    commandCategory: "system",
    usages: "ايقاف",
    cooldowns: 3,
    usePrefix: false
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const { ADMINBOT, NDH } = global.config;
    
    // التحقق من صلاحيات الأدمن
    if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID)) {
        return api.sendMessage("⚠️ هذا الأمر مخصص للأدمن فقط!", threadID, messageID);
    }
    
    const statusPath = './modules/commands/cache/bot_status.json';
    
    // إنشاء الملف إذا لم يكن موجوداً
    if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(statusPath, JSON.stringify({ status: "active" }, null, 2));
    }
    
    let botStatus = { status: "inactive" };
    fs.writeFileSync(statusPath, JSON.stringify(botStatus, null, 2));
    
    return api.sendMessage("🔴 تم إيقاف البوت بنجاح!\n✅ البوت سيستجيب للأدمن فقط الآن", threadID, messageID);
};
