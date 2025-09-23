module.exports.config = {
  name: "فيديو",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ياسين",
  description: "فيديو من يوتوب",
  commandCategory: "خدمات",
  usages: "[searchVideos]",
  cooldowns: 10,
  dependencies: { "ytdl-core": "", "simple-youtube-api": "" }
};

module.exports.handleReply = async function ({ api: e, event: a, handleReply: t }) {
  try {
    const n = global.nodemodule.axios,
      s = global.nodemodule["fs-extra"],
      i = await n.get("https://raw.githubusercontent.com/quyenkaneki/data/main/video.json"),
      r = i.data.keyVideo.length,
      o = i.data.keyVideo[Math.floor(Math.random() * r)],
      { createReadStream: d, createWriteStream: m, unlinkSync: l, statSync: h } = global.nodemodule["fs-extra"];
    var c, u = a.body;
    if (c = u, isNaN(c) || c < 1 || c > 6) return e.sendMessage("Chọn từ 1 -> 6 thôi baby. iu uwu ❤️", a.threadID, a.messageID);
    e.unsendMessage(t.messageID);
    try {
      var g = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: `${t.link[a.body - 1]}` },
        headers: {
          "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
          "x-rapidapi-key": `${o.API_KEY}`
        }
      };
      var p = (await n.request(g)).data,
        y = p.title;
      if ("fail" == p.status) return e.sendMessage("Không thể gửi file này.", a.threadID);
      var f = Object.keys(p.link)[1],
        b = p.link[f][0];
      path1 = __dirname + "/cache/1.mp4";
      const i = (await n.get(`${b}`, { responseType: "arraybuffer" })).data;
      return s.writeFileSync(path1, Buffer.from(i, "utf-8")), e.unsendMessage(t.messageID), s.statSync(__dirname + "/cache/1.mp4").size > 26e6 ? e.sendMessage("Không thể gửi file vì dung lượng lớn hơn 25MB.", a.threadID, (() => l(__dirname + "/cache/1.mp4")), a.messageID) : e.sendMessage({ body: `» ${y}`, attachment: s.createReadStream(__dirname + "/cache/1.mp4") }, a.threadID, (() => s.unlinkSync(__dirname + "/cache/1.mp4")), a.messageID)
    } catch {
      return e.sendMessage("Không thể gửi file này!", a.threadID, a.messageID)
    }
    for (let e = 1; e < 7; e++) l(__dirname + `/cache/${e}.png`)
  } catch (e) {
    console.error(e)
  }
};

module.exports.run = async function ({ api: e, event: a, args: t }) {
  try {
    const n = global.nodemodule.axios,
      s = global.nodemodule["fs-extra"],
      i = await n.get("https://raw.githubusercontent.com/quyenkaneki/data/main/video.json"),
      r = i.data.keyVideo.length,
      o = i.data.keyVideo[Math.floor(Math.random() * r)],
      d = global.nodemodule["ytdl-core"],
      c = global.nodemodule["simple-youtube-api"],
      { createReadStream: m, createWriteStream: l, unlinkSync: h, statSync: u } = global.nodemodule["fs-extra"];
    var g = ["AIzaSyBRycaxsBIsmtjAtFJJYujIteWFmpiAtOg"],
      p = g[Math.floor(Math.random() * g.length)],
      y = new c(p);
    if (0 == t.length || !t) return e.sendMessage("» Phần tìm kiếm không được để trống!", a.threadID, a.messageID);
    const f = t.join(" ");
    if (0 == t.join(" ").indexOf("https://")) {
      var b = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: t.join(" ").split(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/)[3] },
        headers: {
          "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
          "x-rapidapi-key": `${o.API_KEY}`
        }
      };
      var v = (await n.request(b)).data,
        k = v.title;
      if ("fail" == v.status) return e.sendMessage("Không thể gửi file này.", a.threadID);
      var I = Object.keys(v.link)[1],
        x = v.link[I][0];
      path1 = __dirname + "/cache/1.mp4";
      const i = (await n.get(`${x}`, { responseType: "arraybuffer" })).data;
      return s.writeFileSync(path1, Buffer.from(i, "utf-8")), s.statSync(__dirname + "/cache/1.mp4").size > 26e6 ? e.sendMessage("Không thể gửi file vì nó có dung lượng lớn hơn 25MB.", a.threadID, (() => h(__dirname + "/cache/1.mp4")), a.messageID) : e.sendMessage({ body: `» ${k}`, attachment: s.createReadStream(__dirname + "/cache/1.mp4") }, a.threadID, (() => s.unlinkSync(__dirname + "/cache/1.mp4")), a.messageID)
    }
    try {
      const t = global.nodemodule["fs-extra"],
        n = global.nodemodule.axios;
      var w = [],
        _ = "",
        D = 0,
        S = 0,
        M = [],
        $ = await y.searchVideos(f, 6);
      for (let e of $) {
        if (void 0 === e.id) return;
        w.push(e.id);
        e.id;
        let a = __dirname + `/cache/${S += 1}.png`,
          s = `https://img.youtube.com/vi/${e.id}/hqdefault.jpg`,
          i = (await n.get(`${s}`, { responseType: "arraybuffer" })).data,
          r = (await n.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${e.id}&key=${p}`)).data.items[0].contentDetails.duration.slice(2).replace("S", "").replace("M", ":");
        (await n.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${e.id}&key=${p}`)).data.items[0].snippet.channelTitle;
        if (t.writeFileSync(a, Buffer.from(i, "utf-8")), M.push(t.createReadStream(__dirname + `/cache/${S}.png`)), 1 == (D = D += 1)) var x = "⓵";
        if (2 == D) x = "⓶";
        if (3 == D) x = "⓷";
        if (4 == D) x = "⓸";
        if (5 == D) x = "⓹";
        if (6 == D) x = "⓺";
        _ += `${x} 《${r}》 ${e.title}\n\n`
      }
      var j = `»🔎 Có ${w.length} قائمة تطابق الكلمات الرئيسية للبحث:\n\n${_}» الرجاء الرد ، حدد أحد عمليات البحث أعلاه`;
      return e.sendMessage({ attachment: M, body: j }, a.threadID, ((e, t) => global.client.handleReply.push({ name: this.config.name, messageID: t.messageID, author: a.senderID, link: w })), a.messageID)
    } catch (t) {
      return e.sendMessage("تعذر معالجة الطلب بسبب خطأ في الوحدة النمطية: " + t.message, a.threadID, a.messageID)
    }
  } catch (t) {
    console.error(t);
    return e.sendMessage(`حدث خطأ: ${t.message}`, a.threadID, a.messageID)
  }
};
