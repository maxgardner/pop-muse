const request = require('request');
const cheerio = require('cheerio');

function randomColor() {
  let colors = [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ];

  let randomIndex = Math.floor(Math.random() * 5);
  return colors[randomIndex];
}

module.exports = function (router, Article, Comment, Author) {
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

  router.post("/:articleid/comments", (req, res) => {

  // Create new author if there isn't one

    Author.findOneAndUpdate({
      email: req.body.email
    }, {
      $set: {
        name: req.body.name,
        email: req.body.email
      }
    }, {
      upsert: true,
      new: true
    })
    .exec((err, author) => {
      if (err) {
        res.send(err);
      };

  // Save comment

      let commentData = {
        comment: req.body.comment,
        author: author._id
      };
      let comment = new Comment(commentData);

      comment.save((err, newComment) => {
        let commentId = newComment._id;
        if (err) {
          res.send(err);
        };

  // Add comment ID to author

        Author.findByIdAndUpdate(commentData.author, {
          $push: {
            comments: commentId
          }
        }, {
          new: true
        })
        .exec((err, updatedAuthor) => {

  // Add comment ID to article

          Article.findByIdAndUpdate(req.params.articleid, {
            $push: {
              comments: commentId
            }
          }, {
            new: true
          })
          .exec((err, article) => {
            if (err) {
              res.send(err);
            }

            res.send(article);
          });
        });
      });
    });
  });

  router.delete('/:commentid', (req, res) => {

  // First find author to access author id
    Author.findOne({
      email: req.body.email
    })
    .exec((err, author) => {
      if (err) {
        res.send(err);
        return;
      }

      if (!author) {
        res.send("Incorrect email");
        return;
      }

      let authorId = author._id;

  // Use author id to confirm comment to remove belongs to requester
      Comment.findOneAndRemove({
        _id: req.params.commentid,
        author: authorId
      })
      .exec((err, comment) => {
        if (err) {
          res.send(err);
          return;
        }

  // Remove the deleted comment's id from the author document
        Author.findOneAndUpdate({
          _id: author._id
        }, {
          $pull: {
            comments: req.params.commentid
          }
        }, {
          new: true
        })
        .exec((err, updatedAuthor) => {
          if (err) {
            res.send(err);
            return;
          }
          res.send(updatedAuthor);
        });
      });
    });
  });

  return router;
}
