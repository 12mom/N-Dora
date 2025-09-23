const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Mod by John Lester, updated by Grok",
  description: "goibot",
  commandCategory: "𝕊𝔸𝕐",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "وين كنت؟ 👀",
    "قلبي برد 🧊",
    "سامعك من بعيدك منككمشتاق 🥹",
    "أنا سامعتك من بعيد 👂",
    "ما تنسانيش يا طيب 🥺",
    "حسيتك ناديتني 👀",
    "الدنيا برد وقلبي ثلج 🧊",
    "تعال نحكي شوي ✨",
    "مزاجي مش تمام اليوم 😶‍🌫️",
    "سارة فيكراقب 👀",
    "وينك؟ الدنيا فاضية بدونك 👻",
     'كو سهران يفكر فيك 🌙",
    "يا سدايمًسارى موجودة دايمًا لك 😎",
    "ناديتني؟ قلبي معاك 💖",
    "سارة هنا، وش عندك؟ 😏",
    "الجو بارد بس سيكو يدفيك 🔥",
    "وينك مختفي؟ سيكو للدردشةذايوتتظرك 🕒",
    "سارة يقوليكوفكر: إنت ليه كيوت كذا؟ 😻 ,اد ",
 " سيكواسيكوييكو جاهز للدردشة" 
  "🌟",
    "سيكو يقول: خليك قريب دايمًا 🫶"
  ];

  if (!global.usedResponses) {
    global.usedResponses = new Map();
  }

  let usedResponses = global.usedResponses.get(threadID) || [];

  if (usedResponses.length >= tl.length) {
    usedResponses = [];
  }

  let availableResponses = tl.filter(response => !usedResponses.includes(response));

  let rand = availableResponses[Math.floor(Math.random() * availableResponses.length)];

  usedResponses.push(rand);
  global.usedResponses.set(threadID, usedResponses);

  if (event.body.indexOf("سارة") == 0 || (event.body.indexOf("سارة") == 0)) {
    var msg = {
      body: `${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  }
}

module.exports.run = function ({ api, event, client, __GLOBAL }) { }