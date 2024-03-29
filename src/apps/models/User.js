module.exports = (mongoose) => {
  const User = mongoose.model(
    "users",
    mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      post_ids: Array,
      register_code: Number,
      bio: String,
      temp_pass: Object
    })
  );
  return User;
};
