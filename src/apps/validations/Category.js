const Joi = require("joi");

module.exports = class Auth {
  async createCategory(req) {
    const title = req.body.title;
    const upload_file = req.file;

    const schema = Joi.object({
      title: Joi.string().required().messages({
        "string.empty": `لطفاً عنوان دسته بندی خود را وارد کنید`,
        "any.required": `لطفاً عنوان دسته بندی خود را وارد کنید`,
      }),
      upload_file: Joi.required().messages({
        "string.empty": `لطفاً عکس دسته بندی خود را بارگذاری کنید`,
        "any.required": `لطفاً عکس دسته بندی خود را بارگذاری کنید`,
      }),
    });
    try {
      await schema.validateAsync({ title, upload_file });
      return true;
    } catch (err) {
      //validation errors
      return err;
    }
  }
};
