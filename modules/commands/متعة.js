const GryKJ = {};

GryKJ.config = {
  name: "القحبة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Gry KJ",
  description: "yo",
  commandCategory: "yo",
  usages: "yo",
  cooldowns: 5,
};

GryKJ.run = async function({ api, event, args }) {
if (event.senderID != 61576232405796) return api.sendMessage("روح نام الامر ذا لانس فقط", event.threadID);
 function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (!args.join(" ")) return api.sendMessage("حط ايدي القحبة", event.threadID, event.messageID);

const uid = args.join(" ");

if (isNaN(uid)) return api.sendMessage("الايدي خاصو يكون رقم ازبي", event.threadID, event.messageID);

api.sendMessage("تم بدأ ارسال القحبة", event.threadID, event.messageID);

for (let i = 0 ; i < 1000 ; i++) {

api.sendMessage("قحبة",uid);

await delay(5000);

};

};


module.exports = GryKJ;