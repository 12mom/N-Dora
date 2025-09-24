module.exports.config = {
  name: "اوامر",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "كولو سان 🇸🇩",
  description: "قائمة الأوامر كاملة",
  commandCategory: "النظام",
  usages: "[اسم الأمر | رقم الصفحة]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "✨『 %1 』✨\n📜 الوصف: %2\n⚡ الاستخدام: %3\n📂 الفئة: %4\n⏳ وقت الانتظار: %5 ثانية\n👑 الصلاحية: %6\n\n💡 المطور: %7",
    "helpList": "⚡ يوجد %1 من الأوامر في البوت ⚡\nاستخدم: %2help اسم_الأمر لعرض التفاصيل.\n━━━━━━━━━━━━━━━",
    "user": "👤 مستخدم",
    "adminGroup": "👑 مشرف المجموعة",
    "adminBot": "🔱 مطور البوت"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "cmd" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
        (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  // لو مافي أمر محدد
  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 50;
    let i = 0;

    let msg = "╭─━─━─━─━─━─━─━─━─╮\n";
    msg += "     ✨ قائمة أوامر البوت ✨\n";
    msg += "╰─━─━─━─━─━─━─━─━─╯\n\n";

    for (var [name, value] of (commands)) {
      arrayInfo.push({ name, ...value.config });
    }

    // ترتيب الأوامر حسب الفئة
    const categories = {};
    arrayInfo.forEach(cmd => {
      if (!categories[cmd.commandCategory]) categories[cmd.commandCategory] = [];
      categories[cmd.commandCategory].push(cmd);
    });

    for (let category in categories) {
      msg += `📂 【 ${category.toUpperCase()} 】 📂\n`;
      categories[category].forEach(cmd => {
        msg += `✨ ${++i}. ${cmd.name}\n   📜 ${cmd.description}\n`;
      });
      msg += "━━━━━━━━━━━━━━━\n\n";
    }

    msg += `📖 الصفحة: (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n`;
    msg += `👑 البادئة: 「 ${prefix} 」\n`;
    msg += `⚡ عدد الأوامر: ${arrayInfo.length}\n`;
    msg += "━━━━━━━━━━━━━━━\n";
    msg += "💡 المطور: كولو سان 🇸🇩";

    return api.sendMessage(msg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  }

  // لو أمر معين
  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
        (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID,
    messageID
  );
};
