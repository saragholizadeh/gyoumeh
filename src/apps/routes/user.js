const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");
const isLoggedIn = require("../../middlewares/isLoggedIn");

router.get("/", controller.main);
router.get("/posts/:category/:postTitle", controller.getPost);
router.get("/category/:category", controller.getPosts);
router.get("/404", controller.notFound);

router.post(
  "/addComment/posts/:category/:postTitle",
  isLoggedIn,
  controller.addComment
);

router.get("/dashboard", isLoggedIn, controller.dashboard);
module.exports = router;
