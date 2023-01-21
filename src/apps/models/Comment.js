module.exports = (mongoose) => {
    const Comment = mongoose.model(
      "comments",
      mongoose.Schema({
        name: String,
        email: String,
        comment: String,
        created_at: Number
      })
    );
    return Comment;
  };
  