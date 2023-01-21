
module.exports = async function getCategories(req, res, next) {
  if(req.user){
    next();

  }else{
    req.flash("error", "ابتدا وارد گیومه شوید");
    res.redirect( "/auth/login");
  }
};

