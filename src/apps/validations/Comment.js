const Joi = require("joi");

module.exports = class addComment {
  async addComment(req) {
    const name = req.body.name;
    const email = req.body.email;
    const comment = req.body.comment;

    const schema = Joi.object({
      name: Joi.string().required().messages({
        "string.empty": `لطفاً نام خود را وارد کنید`,
        "any.required": `لطفاً نام خود را وارد کنید`,
      }),
      email: Joi.string().required().messages({
        "string.empty": `لطفاً ایمیل خود را وارد کنید`,
        "any.required": `لطفاً ایمیل خود را وارد کنید`,
      }),
      comment: Joi.string().required().min(5).messages({
        "string.empty": `لطفاً محتوای نظر خود را وارد کنید`,
        "string.min": "محتوای نظر شما باید بیشتر از 5 کاراکتر باشد",
        "any.required": `لطفاً محتوای نظر خود را وارد کنید`,
      }),
    });
    try {
      await schema.validateAsync({ name, email, comment });
      return true;
    } catch (err) {
      //validation errors
      return err;
    }
  }
};
