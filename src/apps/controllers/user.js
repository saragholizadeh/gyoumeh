const db = require("../models/index");
const User = db.users;
const Tutarial = db.tutarials;
const Category = db.categories;

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

  res.render("pages/index", { posts: postsArr, titles});
};

exports.getPost = async (req, res) => {
  var solarDate = new DateConverter();

  const post = await Tutarial.findOne({
    title: req.params.postTitle,
    category: req.params.category,
  });
  var author = await User.findById(post.author_id);

  const image = post.image.path;
  obj = {
    title: post.title,
    date: solarDate.timestampToSolar(post.created_at),
    category: post.category,
    author: author.name,
    tags: post.tags,
    comments: post.comments.length,
    body: post.body,
    image,
  };

  var similarPosts = await Tutarial.find({ category: req.params.category, title: {$ne: req.params.postTitle}})
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
    const posts = await Tutarial.find({ category: req.params.category }).sort({ $natural: -1 });

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
          comments: post.comments.length
        };

        array.push(obj);
      }
      var categoryImage = category.image.path;
      categoryImage = categoryImage.replace(/\\/g, "/");

      res.render("pages/category-posts", {
        posts: array,
        category: req.params.category,
        categoryImage : categoryImage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/404");
  }
};

exports.authorForm = async (req, res) => {
  res.render("pages/author-form");
};

exports.submitAuthorForm = async (req, res) => {};

exports.notFound = (req, res) => {
  res.render("pages/not-found");
};


