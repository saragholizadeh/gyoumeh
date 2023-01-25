const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");
const isLoggedIn = require("../../middlewares/isLoggedIn");


//get posts (cat & signle post & tag)
router.get("/", controller.main);
router.get("/posts/:category/:postTitle", controller.getPost);
router.get("/category/:category", controller.getPosts);
router.get("/tags/:tagName", controller.getTagPosts)
router.get("/404", controller.notFound);


//comments
router.post(
  "/addComment/posts/:category/:postTitle",
  isLoggedIn,
  controller.addComment
);


//user prof & dashbaord
router.get("/dashboard", isLoggedIn, controller.dashboard);
router.get("/profile/:userId", controller.profile);



module.exports = router;
