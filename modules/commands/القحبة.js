const GryKJ = {};

GryKJ.config = {
    name: "المتعة",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Gry KJ",
    description: "yo",
    commandCategory: "yo",
    usages: "yo",
    cooldowns: 5,
};

GryKJ.run = async function ({ api, event, args, permssion }) {

    const developerID = "61576232405796";         

    if (event.senderID !== developerID) return api.sendMessage("هذا الأمر صالح للمطور فقط.", event.threadID, event.messageID);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (!args.join(" ")) return api.sendMessage("حط ايدي القحبة", event.threadID, event.messageID);

    const uid = args.join(" ");

    if (isNaN(uid)) return api.sendMessage("الايدي خاصو يكون رقم ازبي", event.threadID, event.messageID);

    api.sendMessage("تم بدأ ارسال القحبة", event.threadID, event.messageID);

    for (let i = 0; i < 1000; i++) {
        api.sendMessage("قحبة", uid);
        await delay(5000);
    };
};

module.exports = GryKJ;