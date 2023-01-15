
module.exports = async function getCategories(req, res, next) {
  if(!req.user){
    next();

  }else{
    res.redirect("/")
  }
};
