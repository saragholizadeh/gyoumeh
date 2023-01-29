const db = require("../models/index");
const User = db.users;
const Jwt = require("../../helpers/jwt");
const EmailClient = require("../../services/EmailClient");
const AuthValidation = require("../validations/Auth");
const getRandomNumber = require("../../helpers/random-number");

exports.login = (req, res) => {
  res.render("pages/auth/login");
};

exports.loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const validation = new AuthValidation();
  const validatedDate = await validation.loginUser(email, password);

  if (validatedDate == true) {
    const getUser = await User.findOne({ email, password });

    if (getUser && !getUser.register_code) {
      //signed in successfully
      const jwt = new Jwt();
      const cookie = jwt.sign("refresh", email);
      res.clearCookie("email_verification");
      res
        .cookie("login", cookie, {
          maxAge: 2592000000,
          httpOnly: true,
        })
        .redirect("/");
    } else {
      //User not found error
      var messages = "رمز عبور یا ایمیل شما اشتباه می‌باشد";
      req.flash("error", messages);
      res.redirect("/auth/login");
    }
  } else {
    //validation errors
    req.flash("error", validatedDate);
    res.redirect("/auth/login");
  }
};

exports.register = (req, res) => {
  res.render("pages/auth/register");
};

exports.registerUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_pass = req.body.confirm_pass;

  const validation = new AuthValidation();
  const validatedDate = await validation.registerUser(
    name,
    email,
    password,
    confirm_pass
  );

  if (validatedDate == true) {
    const getUser = await User.findOne({ email });
    if (getUser && !getUser.register_code) {
      //Error: user exists;
      error = "این آدرس ایمیل از قبل ثبت نام شده است";
      req.flash("error", error);
      res.redirect("/auth/register");
    } else {
      //Send a verification code to email
      const emailClient = new EmailClient();
      const code = getRandomNumber(4);
      emailClient.sendVerificationCode(email, code);

      if (getUser && getUser.register_code) {
        await User.deleteOne({ email });
      }

      //save user and code details on database
      await User.create({
        name,
        email,
        password,
        role: "user",
        register_code: code,
      });
      //create a JWT value and pass to cookies
      const jwt = new Jwt();
      const cookie = jwt.sign("access", `${email}`);

      //redirect to verification email code
      res
        .cookie("email_verification", cookie, {
          maxAge: 1000 * 60 * 15,
          httpOnly: true,
        })
        .redirect("/auth/verification");
    }
  } else {
    //validation errors
    req.flash("error", validatedDate);
    res.redirect("/auth/register");
  }
};

exports.verification = async (req, res) => {
  res.render("pages/auth/verification");
};

exports.verificate = async (req, res) => {
  const code = req.body.code;

  const validation = new AuthValidation();
  const validatedDate = await validation.verifyEmail(code);

  if (validatedDate == true) {
    const cookies = req.cookies.email_verification;
    if (cookies) {
      //check user if the code is correct
      var error = "";
      try {
        const jwt = new Jwt();
        const email = jwt.verify("access", cookies);
        var user = await User.findOne({ email: email.data });

        if (user) {
          if (user.register_code && user.register_code == code) {
            res.clearCookie("email_verification");

            //delete register code
            await User.updateOne(
              { email: email.data },
              { $unset: { register_code: 1 } }
            );

            const cookie = jwt.sign("refresh", email.data);
            res
              .cookie("login", cookie, {
                maxAge: 2592000000,
                httpOnly: true,
              })
              .redirect("/");
          } else {
            error = "کد وارد شده صحیح نمی‌باشد";
            req.flash("error", error);
            res.redirect("/auth/verification");
          }
        } else {
          //user doesn't exists error and clear cookies
          res.clearCookie("email_verification");
          error = "کد وارد شده صحیح نمی‌باشد";
          req.flash("error", error);
          res.redirect("/auth/verification");
        }
      } catch (err) {
        //clean cookies
        console.log(err);
        req.flash("error", error);
        res.redirect("/auth/verification");
      }
    } else {
      res.redirect("/auth/register");
    }
  } else {
    req.flash("error", validatedDate);
    res.redirect("/auth/verification");
  }
};

exports.logout = async (req, res) =>{
  res.clearCookie("login").redirect("/");
}