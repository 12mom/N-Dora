const fs = require("fs");
const request = require("request");
const { join } = require("path");

function getUserMoney(senderID) {
  const pathData = join(__dirname, 'banking', 'banking.json');
  if (fs.existsSync(pathData)) {
    const user = require(pathData);
    const userData = user.find(user => user.senderID === senderID);
    return userData ? userData.money : 0;
  } else {
    return 0;
  }
}

function getRank(exp) {
  if (exp >= 100000) return 'خارق🥇';
  if (exp >= 20000) return '🥈عظيم';
  if (exp >= 10000) return '👑أسطوري';
  if (exp >= 8000) return 'نشط🔥 قوي';
  if (exp >= 4000) return '🌠نشط';
  if (exp >= 2000) return 'متفاعل🏅 قوي';
  if (exp >= 1000) return '🎖️متفاعل جيد';
  if (exp >= 800) return '🌟متفاعل';
  if (exp >= 500) return '✨لا بأس';
  if (exp >= 300) return '👾مبتدأ';
  if (exp >= 100) return '🗿صنم';
  return 'ميت⚰️';
}

function getUserGender(genderCode) {
  if (genderCode === 2) return 'ولد';
  if (genderCode === 1) return 'فتاة';
  return '';
}

module.exports.config = {
  name: "ايدي",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "ǺᎩᎧᏬᏰ",
  description: "user facebookID",
  commandCategory: "🎮الالعاب🎮",
  cooldowns: 0,
};

module.exports.run = async function ({ args, api, event, Currencies, client }) {
  try {
    const data = await api.getThreadInfo(event.threadID);
    const storage = [];
    for (const value of data.userInfo) {
      storage.push({ id: value.id, name: value.name });
    }

    const exp = [];
    for (const user of storage) {
      const countMess = await Currencies.getData(user.id);
      exp.push({
        name: user.name,
        exp: typeof countMess.exp == "undefined" ? 0 : countMess.exp,
        uid: user.id,
      });
    }

    exp.sort((a, b) => {
      if (a.exp > b.exp) return -1;
      if (a.exp < b.exp) return 1;
      return 0;
    });

    const userId = event.type == "message_reply" ? event.messageReply.senderID : event.senderID;
    const infoUser = exp.find(info => parseInt(info.uid) === parseInt(userId));

    const id = event.type == "message_reply" ? event.messageReply.senderID : event.senderID;
    const user_data = await api.getUserInfo(id);
    const name = user_data[id].name;
    const gender = getUserGender(user_data[id].gender);

    const pictureCallback = async () => {
      try {
        const moneyFromFile = getUserMoney(id); 
        const moneyFromUserData = (await Currencies.getData(id)).money || 0; 

        const rank = getRank(infoUser.exp);

        const msg = `اسمك👤: 『${name}』\nرسائلك✉️️: 『${infoUser.exp}』\nتصنيفك: 『${rank}』\nالبنك💰: 『${moneyFromFile}💲』\nالكاش💰: 『${moneyFromUserData}💵』`;

        api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(__dirname + "/cache/1.png"),
        }, event.threadID, () => {
          fs.unlinkSync(__dirname + "/cache/1.png");
        });

      } catch (error) {
        console.error(error);
      }
    };

    const pictureRequest = request(
      encodeURI(
        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      )
    );

    pictureRequest.pipe(fs.createWriteStream(__dirname + "/cache/1.png")).on("close", pictureCallback);

    api.sendMessage(
      ``,
      event.threadID
    );
  } catch (error) {
    console.error(error);

    api.sendMessage(
      `حدث خطأ: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};