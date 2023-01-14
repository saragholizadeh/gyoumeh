const Joi = require("joi");

module.exports = class Auth {
  async loginUser(email, password) {
    const schema = Joi.object({
      email: Joi.string().required().messages({
        "string.empty": `لطفاً ایمیل خود را وارد کنید`,
        "any.required": `لطفاً ایمیل خود را وارد کنید`,
      }),
      password: Joi.string().min(4).alphanum().required().messages({
        "string.empty": `لطفاً رمزعبور خود را وارد کنید`,
        "string.min": `رمز عبور شما باید حداقل 4 کاراکتر باشد`,
        "any.required": `لطفاً رمزعبور خود را وارد کنید`,
      }),
    });
    try {
      await schema.validateAsync({ email, password });
      return true;
    } catch (err) {
      //validation errors
      const error = err.toString().replace("ValidationError:", "");
      return error;
    }
  }

  async registerUser(name, email, password, confirm_pass) {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        "string.empty": `لطفاً نام خود را وارد کنید`,
        "any.required": `لطفاً نام خود را وارد کنید`,
      }),
      email: Joi.string().required().messages({
        "string.empty": `لطفاً ایمیل خود را وارد کنید`,
        "any.required": `لطفاً ایمیل خود را وارد کنید`,
      }),
      password: Joi.string().min(4).alphanum().required().messages({
        "string.empty": `لطفاً رمزعبور خود را وارد کنید`,
        "string.min": `رمز عبور شما باید حداقل 4 کاراکتر باشد`,
        "any.required": `لطفاً رمزعبور خود را وارد کنید`,
      }),
      confirm_pass: Joi.any().valid(Joi.ref("password")).required().messages({
        "string.empty": `لطفاً رمزعبور خود را وارد کنید`,
        "string.min": `رمز عبور شما باید حداقل 4 کاراکتر باشد`,
        "string.confirm_pass": `رمز عبور با تکرار آن یکسان نمیباشد`,
        "any.required": `لطفاً رمزعبور خود را وارد کنید`,
      }),
    });

    try {
      await schema.validateAsync({ name, email, password, confirm_pass });
      return true;
    } catch (err) {
        console.log(err);
      const error = err.toString().replace("ValidationError:", "");
      return error;
    }
  }

  async verifyEmail(code){
    const schema = Joi.object({
        code: Joi.string().required().length(4).messages({
          "string.empty": `لطفاً کد تایید را وارد کنید`,
          "string.length": `کد شما بایستی چهار رقم باشد`,
        }),
      });
      try{
       await schema.validateAsync({ code });
        return true;
      }catch(err){
        const error = err.toString().replace("ValidationError:", "");
        return error;
      }
  }
};
