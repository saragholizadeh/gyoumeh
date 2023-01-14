const db = require("../apps/models");
const Category = db.categories;

module.exports = async function getCategories(req, res, next) {
  // look up the user based on the token
  const categories = await Category.find();
  var array = [];
  for (let i = 0; i < categories.length; i++) {
    array.push(categories[i].title);
  }
  res.locals.categories = array;

  next();
};
