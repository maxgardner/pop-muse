module.exports = function (router, Article, Comment) {
  router.get("/", (req, res) => {
    Article.find({})
    .populate("comments")
    .exec((err, articles) => {
      if (err) throw err;
      let content = {
        articles: articles
      };
      res.render("index", content);
    });
  });

  return router;
}
