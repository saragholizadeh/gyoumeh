module.exports = (mongoose) => {
  const Category = mongoose.model(
    "categories",
    mongoose.Schema({
      title: String,
      image: Object,
    })
  );
  return Category;
};
