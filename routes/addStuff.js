const request = require('request');
const cheerio = require('cheerio');

function randomColor() {
  let colors = [
    "card-outline-primary",
    "card-outline-success",
    "card-outline-info",
    "card-outline-warning",
    "card-outline-danger"
  ];

  let randomIndex = Math.floor(Math.random() * 5);
  return colors[randomIndex];
}

module.exports = function (router, Article, Comment) {
  router.get("/update", (req, res) => {
    request('http://www.mtv.com/news/music/', (err, res, body) => {
      if (err) throw err;
      let $ = cheerio.load(body);

      $('a[class="post"]').each((i, element) => {
        let result = {};

        let link = $(element).attr("href");
        let title = $(element).children("span").text().trim();
        let cardClass = randomColor();

        Article.findOneAndUpdate({
          link: link
        }, {
          $set: {
            title: title,
            link: link,
            class: cardClass
          }
        }, {
          upsert: true,
          new: true
        }).exec((err, article) => {
          if (err) throw err;
          console.log("Successfully added article to db!");
        });
      });
    });
    res.redirect("/");
  });

  router.post("/:article", (req, res) => {

  });

  return router;
}
