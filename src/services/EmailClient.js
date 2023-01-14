const nodemailer = require('nodemailer');
const { NODEMAILER_HOST, NODEMAILER_PASS, NODEMAILER_PORT, NODEMAILER_USER } = process.env;

module.exports = class EmailClient {
  constructor () {
    this.user = NODEMAILER_USER;
    this.pass = NODEMAILER_PASS;
    this.host = NODEMAILER_HOST;
    this.port = NODEMAILER_PORT;
  }

  sendVerificationCode (email, code) {
    const subject = "تایید ایمیل";
    const text = "کد تایید شما برای ثبت نام در گیومه" + code;
    const transporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: false,
        tls:{
            rejectUnauthorized: false,
        },
        auth:{
            user: this.user,
            pass: this.pass,
        },
    });
    const mailOptions = {
        from: this.user,
        to: email,
        subject,
        text,
      };
  
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err) => {
          if (!err) return resolve();
          return reject(err);
        });
      });
  }
};
