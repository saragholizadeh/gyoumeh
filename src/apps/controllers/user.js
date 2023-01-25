const db = require("../models/index");
const User = db.users;
const Tutarial = db.tutarials;
const Category = db.categories;
const Comment = db.comments;
const CommentValidation = require("../validations/Comment");

const DateConverter = require("../../helpers/date-converter");

exports.main = async (req, res) => {
  var posts = await Tutarial.find().sort({ $natural: -1 }).limit(10);
  bodyPosts = posts.splice(0, 5);
  var solarDate = new DateConverter();

  var postsArr = [];
  for (let i = 0; i < bodyPosts.length; i++) {
    var post = bodyPosts[i];

    var author = await User.findById(post.author_id);
    var postBody = post.body.slice(0, 275) + "...";

    obj = {
      title: post.title,
      image: post.image.path,
      date: solarDate.timestampToSolar(post.created_at),
      category: post.category,
      author: author.name,
      tags: post.tags,
      body: postBody,
    };

    postsArr.push(obj);
  }

  var titles = [];
  for (let i = 0; i < posts.length; i++) {
    obj = {
      title: posts[i].title,
      date: solarDate.timestampToSolar(posts[i].created_at),
    };
    titles.push(obj);
  }

  res.render("pages/index", { posts: postsArr, titles });
};

exports.getPost = async (req, res) => {
  var solarDate = new DateConverter();

  const post = await Tutarial.findOne({
    title: req.params.postTitle,
    category: req.params.category,
  });

  var author = await User.findById(post.author_id);

  const image = post.image.path;

  var comments = [];
  for (let i = 0; i < post.comments.length; i++) {
    var comment = await Comment.findById(post.comments[i]);
    comment["date"] = solarDate.timestampToSolar(comment.created_at);
    comments.push(comment);
  }

  console.log({ comments });

  obj = {
    title: post.title,
    date: solarDate.timestampToSolar(post.created_at),
    category: post.category,
    author: author.name,
    tags: post.tags,
    comments: comments,
    body: post.body,
    image,
  };

  var similarPosts = await Tutarial.find({
    category: req.params.category,
    title: { $ne: req.params.postTitle },
  })
    .sort({ $natural: -1 })
    .limit(6);

  var posts = [];
  for (let i = 0; i < similarPosts.length; i++) {
    var object = {
      title: similarPosts[i].title,
      image: similarPosts[i].image.path,
      date: solarDate.timestampToSolar(similarPosts[i].created_at),
      category: req.params.category,
    };

    posts.push(object);
  }

  res.render("pages/post-details", { post: obj, similarPosts: posts });
};

exports.getPosts = async (req, res) => {
  const category = await Category.findOne({ title: req.params.category });
  if (category) {
    const posts = await Tutarial.find({ category: req.params.category }).sort({
      $natural: -1,
    });

    var solarDate = new DateConverter();
    array = [];

    try {
      for (let i = 0; i < posts.length; i++) {
        var post = posts[i];
        var author = await User.findById(post.author_id);
        var postBody = post.body.slice(0, 150) + "...";

        obj = {
          title: post.title,
          image: post.image.path,
          date: solarDate.timestampToSolar(post.created_at),
          category: post.category,
          author: author.name,
          tags: post.tags,
          body: postBody,
          comments: post.comments.length,
        };

        array.push(obj);
      }
      var categoryImage = category.image.path;
      categoryImage = categoryImage.replace(/\\/g, "/");

      res.render("pages/category-posts", {
        posts: array,
        category: req.params.category,
        categoryImage: categoryImage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/404");
  }
};

exports.addComment = async (req, res) => {
  const validation = new CommentValidation();
  const validatedData = await validation.addComment(req);

  if (validatedData == true) {
    const timestamp = parseInt(new Date().getTime() / 1000);

    const comment = {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      created_at: timestamp,
    };

    const createComment = await Comment.create(comment);
    await Tutarial.updateOne(
      { title: req.params.postTitle },
      { $push: { comments: createComment._id } }
    );

    req.flash("success", "نظر شما با موفقیت ثبت شد");
    res.redirect(`/posts/${req.params.category}/${req.params.postTitle}`);
  } else {
    const error = validatedData.toString().replace("ValidationError:", "");
    req.flash("error", error);
    res.redirect(`/posts/${req.params.category}/${req.params.postTitle}`);
  }
};

exports.dashboard = async (req, res) => {
  var solarDate = new DateConverter();
  const user = await User.findOne({ email: req.user.email });
  const posts = await Tutarial.find({ author_id: user._id })
    .sort({
      $natural: -1,
    })
    .limit(3);

  const postsArr = [];
  for (let i = 0; i < posts.length; i++) {
    var post = posts[i];
    var postBody = post.body.slice(0, 150) + "...";

    obj = {
      title: post.title,
      image: post.image.path,
      date: solarDate.timestampToSolar(post.created_at),
      category: post.category,
      tags: post.tags,
      body: postBody,
      comments: post.comments.length,
    };
    postsArr.push(obj);
  }

  res.render("pages/dashboard", { user, posts: postsArr });
};

exports.profile = async (req, res) => {
  try{
    const user = await User.findById( req.params.userId );
    if(user){
      res.render("pages/profile" , {req , author: user});
  
  
    }else{
      res.render("pages/not-found")
    }
  }catch(err){
    res.render("pages/not-found")

  }

  // var solarDate = new DateConverter();
  // const user = await User.findOne({ email: req.user.email });
  // const posts = await Tutarial.find({ author_id: user._id })
  //   .sort({
  //     $natural: -1,
  //   })
  //   .limit(3);

  // const postsArr = [];
  // for (let i = 0; i < posts.length; i++) {
  //   var post = posts[i];
  //   var postBody = post.body.slice(0, 150) + "...";

  //   obj = {
  //     title: post.title,
  //     image: post.image.path,
  //     date: solarDate.timestampToSolar(post.created_at),
  //     category: post.category,
  //     tags: post.tags,
  //     body: postBody,
  //     comments: post.comments.length,
  //   };
  //   postsArr.push(obj);
  // }

  // res.render("pages/profile", { user, posts: postsArr });
};

exports.notFound = (req, res) => {
  res.render("pages/not-found");
};
