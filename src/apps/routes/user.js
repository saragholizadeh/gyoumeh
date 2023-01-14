const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");

router.get("/", controller.main);
router.get("/posts/:category/:postTitle", controller.getPost);
router.get("/category/:category", controller.getPosts);
router.get("/404", controller.notFound);
module.exports = router;
