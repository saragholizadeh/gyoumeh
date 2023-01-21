module.exports = (mongoose) => {
  const Tag = mongoose.model(
    "tags",
    mongoose.Schema({
      name: String,
      posts: Array
    })
  );
  return Tag;
};
