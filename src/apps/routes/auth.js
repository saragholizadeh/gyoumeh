const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth");

//add a middleware for check if user is login or not 
router.get("/login", controller.login);
router.post("/login", controller.loginUser);

router.get("/register", controller.register);
router.post("/register", controller.registerUser);

router.get("/verification", controller.verification);
router.post("/verification", controller.verificate);

module.exports = router;
