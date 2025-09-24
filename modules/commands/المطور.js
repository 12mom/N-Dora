module.exports.config = {
  name: "المطور",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كولو",
  description: "يعرض معلومات المطور بطريقة دورا",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  try {
    // البداية
    await api.sendMessage("🤖🔍 هل ترون المطور؟ أنا لا أراه... إذا رأيتم المطور قولو: \"مطور\" 🍭", threadID);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await api.sendMessage("✨ أحسنتم 🎉✨", threadID);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // الرسالة النهائية بمعلومات المطور
    const devInfo = `🌈✨🧑‍💻
اسم المطور: 🍭💖 حمــودي ســان 💖🍭

🔗 رابط الفيسبوك:  
https://www.facebook.com/DoraYogiEXE

🌍 البلد: السودان 🇸🇩
🎭 الشخصية المفضلة: Dora
🎮 ألعاب المطور: Free Fire (ID: 2717565103) 🏴‍☠️
📱 واتساب: +249900042500

💖🍭 "يـــعجــز الأطفــال والمراهقــون عــن تقليــدي" 🍭💖
♥️🥰 أحبكم يا سنافري — أفعل ما بوسعي لإسعادكم 🌸`;

    return api.sendMessage(devInfo, threadID);

  } catch (err) {
    return api.sendMessage("⚠️ حدث خطأ أثناء جلب معلومات المطور.", threadID);
  }
};
