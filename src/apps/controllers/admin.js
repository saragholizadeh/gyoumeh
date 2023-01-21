const db = require("../models/index");
const Category = db.categories;

const CategoryValidation = require("../validations/Category");

exports.categoryCreate = (req, res) => {  
  res.render("pages/admin/addCategory", {
    value: {
      data: {
        title: "",
      },
    },
  });
};

exports.categoryPost = async (req, res) => {
  const validation = new CategoryValidation();
  const validatedDate = await validation.createCategory(req);

  if (validatedDate == true) {
    //save category in database

    const insertCategory = await Category.create({
      title: req.body.title,
      image: req.file,
    });

    req.flash('success', 'دسته بندی شما با موفقیت ثبت شد')
    res.redirect('/')
    //redirect to dashbaord
  } else {
    //validation errors
    const value = {
      data: validatedDate._original,
    };

    const error = validatedDate.toString().replace("ValidationError:", "");
    req.flash("error", error);
    res.render("pages/admin/addCategory", { value });
  }
};
