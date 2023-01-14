const getUser = require("../helpers/get-user");

module.exports = async function setCurrentUser(req, res, next) {
  const cookies = req.cookies.login

  // look up the user based on the token
  await getUser(cookies).then(user => {
    // append the user object the the request object
    req.user = user;
    res.locals.user = user;

    // call next middleware in the stack
    next();
  });
};