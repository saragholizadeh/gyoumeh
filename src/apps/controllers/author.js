const db = require("../models/index");
const Category = db.categories;
const User = db.users;
const Tutarial = db.tutarials;
const Tag = db.tags;

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
    const jwt = new Jwt();
    const email = jwt.verify("refresh", cookies);
    var user = await User.findOne({ email: email.data });

    const timestamp = parseInt(new Date().getTime() / 1000);
    const insertPost = await Tutarial.create({
      title: req.body.title,
      body: req.body.body,
      category: category.title,
      image: req.file,
      author_id: user._id,
      tags,
      created_at: timestamp,
    });

    if (tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const findTag = await Tag.findOne({ name: tag });
        if (findTag) {
          //update posts array
          if (!findTag.posts.includes(insertPost._id)) {
            await Tag.updateOne(
              { name: tag },
              { $push: { posts: insertPost._id } }
            );
          }
        } else {
          //create new tag
          await Tag.create({ name: tag, posts: [insertPost._id] });
        }
      }
    }

    req.flash("success", "پست شما با موفقیت ثبت و در گیومه منتظر شد");
    res.redirect("/");
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

exports.edit = async (req, res) => {
  const post = await Tutarial.findOne({ title: req.params.postTitle });
  res.render("pages/tutarial/edit", {
    value: {
      data: {
        title: post.title,
        category: post.category,
        tags: post.tags,
        body: post.body,
      },
    },
  });
};

exports.update = async (req, res) => {};
