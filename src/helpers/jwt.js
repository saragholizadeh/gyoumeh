require('dotenv').config();
var jwt = require("jsonwebtoken");
const {
  REFRESH_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
} = process.env;

module.exports = class JWT {
  constructor() {
    this.accessKey = ACCESS_TOKEN_PRIVATE_KEY;
    this.refreshKey = REFRESH_TOKEN_PRIVATE_KEY;
    this.accessExp = parseInt(ACCESS_EXPIRES);
    this.refreshExp = parseInt(REFRESH_EXPIRES);
  }

  sign(type, data) {
    console.log(typeof this.refreshExp,this.accessExp);
    var signed;
    switch (type) {
      case "access":
        signed = jwt.sign({data}, this.accessKey, { expiresIn:  this.accessExp });
        break;
      case "refresh":
        signed = jwt.sign({data}, this.refreshKey, { expiresIn: this.refreshExp });
        break;
      default:
        signed = null;
    }

    return signed;
  }

  verify(type, data) {

    var verified;
    switch (type) {
      case "access":
        verified = jwt.verify(data, this.accessKey);
        break;
      case "refresh":
        verified = jwt.verify(data, this.refreshKey);
        break;
      default:
        verified = null;
    }
    
    return verified;
  }
};
