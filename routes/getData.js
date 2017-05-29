module.exports = function (router, Article, Comment, Author) {
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

  router.get("/:articleid/comments", (req, res) => {
    Article.findOne({
      _id: req.params.articleid
    })
    .populate("comments")
    .exec((err, article) => {
      if (err) {
        console.log(err);
        res.send(err);
      }

      let content = {
        article: {
          _id: article._id,
          title: article.title,
          link: article.link,
          class: article.class
        },
        comments: article.comments
      }

      res.render("comments", content)
    });
  });

  return router;
}
