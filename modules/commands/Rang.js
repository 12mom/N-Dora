module.exports.config = {
  name: "الرانك",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "عمر",
  description: "أيقاف وتشغيل أشعار المستوى داخل المجموعة",
  commandCategory: "مسؤولي المجموعات",
  dependencies: {
    "fs-extra": ""
  },
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    unsendMessageAfter: 5
  }
};
module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
  const { threadID, senderID } = event;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  
  const tid = String(threadID);
  const uid = String(senderID);

  const thread = global.data.threadData.get(tid) || {};

  if (thread["rankup"] !== true) return;

  let exp = (await Currencies.getData(uid)).exp;
  exp = exp += 1;
  if (isNaN(exp)) return;

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
    const name = global.data.userName.get(uid) || await Users.getNameUser(uid);
    let messsage = (typeof thread.customRankup == "undefined") ? getText("levelup") : thread.customRankup;

    messsage = messsage
      .replace(/\{name}/g, name)
      .replace(/\{level}/g, level);

    if (existsSync(__dirname + "/rankup/")) mkdirSync(__dirname + "/rankup/", { recursive: true });
    const gifPath = __dirname + `/rankup/received_507463547525629.gif`;
    const arrayContent = existsSync(gifPath)
      ? { body: messsage, attachment: createReadStream(gifPath), mentions: [{ tag: name, id: uid }] }
      : { body: messsage, mentions: [{ tag: name, id: uid }] };

    const moduleName = this.config.name;
    api.sendMessage(arrayContent, tid, async function (error, info){
      if (global.configModule[moduleName].autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 5000));
        return api.unsendMessage(info.messageID);
      }
    });
  }

  await Currencies.setData(uid, { exp });
}

module.exports.languages = {
  "vi": {
    "on": "تم تفعيل",
    "off": "تم ايقاف",
    "successText": "اشعار المستوى!",
    "levelup": "{name}\n🔵لـقـد ارتـفـع مـسـتـواك لـي نـحـدث بـعـض ضـوداء 🔴『{level}』"
  },
  "en": {
    "on": "تم تفعيل",
    "off": "تم ايقاف",
    "successText": "اشعار المستوى!",
    "levelup": "{name}\n🔵لـقـد ارتـفـع مـسـتـواك لـي نـحـدث بـعـض ضـوداء 🔴『{level}』",
  }
}

module.exports.run = async function({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  if (data["rankup"] === true) {
    data["rankup"] = false;
  } else {
    data["rankup"] = true;
  }

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(`${data["rankup"] ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}