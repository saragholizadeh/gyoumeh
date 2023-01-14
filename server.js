const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
var cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");

const db = require("./src/apps/models");
const auth = require("./src/apps/routes/auth");
const user = require("./src/apps/routes/user");
const author = require("./src/apps/routes/author");

//middlwares
const setCurrentUser = require("./src/middlewares/setCurrentUser");
const categories = require("./src/middlewares/getCategories");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/public", express.static("public"));

var corsOptions = {
  origin: "http://localhost:8080",
};

app.set("views", path.join(__dirname, "./src/resources/views"));
app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(flash());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(setCurrentUser);
app.use(categories);

app.use("/auth", auth);
app.use("/", user);
app.use("/a", author);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8080);
    console.log("Admin panel connected to database");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
