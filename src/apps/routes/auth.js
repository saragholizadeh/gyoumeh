const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth");
const notLoggedIn = require("../../middlewares/notLoggedIn");
const isLoggedIn = require("../../middlewares/isLoggedIn");

//add a middleware for check if user is login or not 
router.get("/login", notLoggedIn, controller.login);
router.post("/login",notLoggedIn, controller.loginUser);

router.get("/register",notLoggedIn, controller.register);
router.post("/register",notLoggedIn, controller.registerUser);

router.get("/verification", notLoggedIn, controller.verification);
router.post("/verification", notLoggedIn, controller.verificate);

router.get("/logout", isLoggedIn, controller.logout);

router.get("/forgetPassword", notLoggedIn, controller.forgetPassword);
router.post("/forgetPassword", notLoggedIn, controller.sendForgetPassEmail );

module.exports = router;
