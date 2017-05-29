module.exports = function(mongoose) {

  let AuthorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
  });

  let Author = mongoose.model('Author', AuthorSchema);
  return Author;
}
