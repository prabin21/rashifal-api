const express = require("express");

const app = express();
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
app.use(cors());
const path = require("path");
const port = 3000;
var infobj = {
  Author: "PrabinSubedi",
  github_repo: "https://github.com/prabincodes/rashifal-api",
  ip_address: "working on it",
};

app.get("/", (request, response) => {
  response.sendFile(path.resolve("views", "index.html"));
});
app.get("/info", (request, response) => {
  response.send(infobj);
});
app.get("/hehe", (req, res) => {
  res.send("bipin");
});

app.get("/api/:span/:sign", (req, resp) => {
  const spans = ["weekly", "monthly", "yearly"];

  let n;
  const e = req.params.sign;
  const f = req.params.span;
  const obj1 = {
    message: "/api/:span can only have daily, weekly, monthly or yearly",
  };
  if (!spans.includes(f.toLowerCase())) return resp.send(obj1);
  else {
    switch (e) {
      case "aries":
        n = "mesh";
        break;
      case "taurus":
        n = "brish";
        break;
      case "gemini":
        n = "mithun";
        break;
      case "cancer":
        n = "karkat";
        break;
      case "leo":
        n = "singha";
        break;
      case "virgo":
        n = "kanya";
        break;
      case "libra":
        n = "tula";
        break;
      case "scorpio":
        n = "brischik";
        break;
      case "sagittarius":
        n = "dhanu";
        break;
      case "capricorn":
        n = "makar";
        break;
      case "aquarius":
        n = "kumbha";
        break;
      case "pisces":
        n = "meen";
        break;
    }
    let ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const aip = ip.split(",", 1);

    if ((e = n)) {
      const url = `https://www.hamropatro.com/rashifal/${f}/${n}`;
      console.log(url);
      axios.get(url).then((res) => {
        const $ = cheerio.load(res.data);
        const desc = $(".desc").find("p").text();
        const date = $(".articleTitleNew").find("span").text();
        const dt = date.split(" ");

        const sc = desc.replace("\n", "");
        const obj = {
          date:
            f === "daily"
              ? `${dt[2]} ${dt[1]} ${dt[0]} ${dt[3]}`
              : f === "weekly"
              ? `${dt[1]} - ${dt[3]} ${dt[0]}`
              : f === "monthly"
              ? `${dt[0]} ${dt[1]}`
              : `${dt[0]} ${dt[1]} ${dt[2]}`,
          sun_sign: dt[dt.length - 5],
          prediction: sc,
          ip: aip[0],
        };
        resp.send(obj);
      });
    } else {
      const failobj = {
        message: req.params.sign + " is meant to be a zodiac sign",
      };

      resp.send(failobj);
    }
  }
});
app.get("/all", async (req, res) => {
  const response = await axios("https://www.hamropatro.com/rashifal/daily/");
  const $ = cheerio.load(response.data);

  let da = [];

  for (let i = 0; i < 12; i++) {
    const data = {
      sunsign: $("h3").eq(i).text(),
      prediction: $(".desc").find("p").eq(i).text().split(")", 2)[1],
    };

    da.push(data);
  }
  res.send(da);
});
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express serve r listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
