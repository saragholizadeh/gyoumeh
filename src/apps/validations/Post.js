const Joi = require("joi");

module.exports = class Auth {
  async createPost(req) {
    const title = req.body.title;
    const category = req.body.category;
    const body = req.body.body;
    const upload_file = req.file;

    const schema = Joi.object({
      title: Joi.string().required().messages({
        "string.empty": `لطفاً عنوان مقاله خود را وارد کنید`,
        "any.required": `لطفاً عنوان مقاله خود را وارد کنید`,
      }),
      category: Joi.string().required().messages({
        "string.empty": `لطفاً دسته بندی مقاله خود را انتخاب کنید`,
        "any.required": `لطفاً دسته بندی مقاله خود را انتخاب کنید`,
      }),
      body: Joi.string().required().min(50).messages({
        "string.empty": `لطفاً محتوای مقاله خود را وارد کنید`,
        "string.min": "محتوای مقاله شما باید بیشتر از 50 کاراکتر باشد",
        "any.required": `لطفاً محتوای مقاله خود را وارد کنید`,
      }),
      upload_file: Joi.required().messages({
        "string.empty": `لطفاً عکس مقاله خود را بارگذاری کنید`,
        "any.required": `لطفاً عکس مقاله خود را بارگذاری کنید`,
      }),
    });
    try {
      await schema.validateAsync({ title, category, body, upload_file });
      return true;
    } catch (err) {
      //validation errors
      return err;
    }
  }
};
