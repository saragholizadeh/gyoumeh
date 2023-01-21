const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./User.js")(mongoose);
db.tutarials = require("./Tutarial.js")(mongoose);
db.categories = require("./Category.js")(mongoose);
db.comments = require("./Comment.js")(mongoose);

module.exports = db;
