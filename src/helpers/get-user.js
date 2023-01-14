const Jwt = require("../helpers/jwt");
const db = require("../apps/models");
const User = db.users;

module.exports = async function getUser(cookies) {
  var user = undefined;
  if (cookies) {
    const jwt = new Jwt();
    const email = jwt.verify("refresh", cookies);
    if (email) {
      user = await User.findOne({ email: email.data });
    } 
  } 

  return user;
};
