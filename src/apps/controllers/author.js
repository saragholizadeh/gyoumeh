const db = require("../models/index");
const Category = db.categories;
const User = db.users;
const Tutarial = db.tutarials;
const Jwt = require("../../helpers/jwt");
const PostValidation = require("../validations/Post");
const separeteTags = require("../../helpers/separateTags");

exports.create = (req, res) => {
  res.render("pages/tutarial/create", {
    value: {
      data: {
        title: "",
        category: "",
        tags: "",
        body: "",
      },
    },
  });
};

exports.post = async (req, res) => {
  // console.log(req.body)
  const validation = new PostValidation();
  const validatedDate = await validation.createPost(req);

  if (validatedDate == true) {
    //save post in database
    var tags = req.body.tags;
    tags = separeteTags(tags);

    const category = await Category.findOne({
      id: parseInt(req.body.category),
    });

    const cookies = req.cookies.login;
    const jwt = new Jwt()
    const email = jwt.verify("refresh", cookies);
    var user = await User.findOne({ email: email.data });

    const timestamp = parseInt(new Date().getTime()/1000);
    await Tutarial.create({
      title: req.body.title,
      body: req.body.body,
      category: category.title,
      image: req.file,
      author_id : user._id,
      tags,
      created_at: timestamp
    });

    req.flash('success', 'پست شما با موفقیت ثبت و در گیومه منتظر شد')
    res.redirect('/')
    //redirect to dashbaord
  } else {
    //validation errors
    const value = {
      data: validatedDate._original,
    };

    const error = validatedDate.toString().replace("ValidationError:", "");
    req.flash("error", error);
    res.render("pages/tutarial/create", { value });
  }
};
