module.exports = (mongoose) => {
  const Category = mongoose.model(
    "categories",
    mongoose.Schema({
      title: String,
      id: Number,
      image: Object,
    })
  );
  return Category;
};
