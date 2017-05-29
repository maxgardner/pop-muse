module.exports = function(mongoose) {

  let ArticleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
  });

  let Article = mongoose.model('Article', ArticleSchema);
  return Article;
}
