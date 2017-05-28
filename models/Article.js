module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  let ArticleSchema = new Schema({
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
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  });

  let Article = mongoose.model('Article', ArticleSchema);
  return Article;
}
