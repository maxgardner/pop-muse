module.exports = function(mongoose) {

  let CommentSchema = new mongoose.Schema({
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author"
    }
  });

  let getAuthor = function(next) {
    this.populate('author');
    next();
  }

  // Come back to explore the pre method in deleting comment id from author

  CommentSchema.
  pre('findOne', getAuthor).
  pre('find', getAuthor);

  let Comment = mongoose.model('Comment', CommentSchema);
  return Comment;
}
