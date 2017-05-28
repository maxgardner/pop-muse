module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  let CommentSchema = new Schema({
    comment: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  });

  let Comment = mongoose.model('Comment', CommentSchema);
  return Comment;
}
