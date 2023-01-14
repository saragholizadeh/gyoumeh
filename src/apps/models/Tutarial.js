module.exports = (mongoose) => {
  const Tutarial = mongoose.model(
    "tutarials",
    mongoose.Schema({
      title: String,
      body: String,
      tags: Array,
      image: Object,
      category: String,
      author_id: String,
      comments: Array,
      created_at: Number
    })
  );
  return Tutarial;
};
