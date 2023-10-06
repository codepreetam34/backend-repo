const Category = require("../models/category");
const slugify = require("slugify");
const Product = require("../models/product");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null || parentId === "" || parentId === " ") {
    category = categories.filter((cat) => cat.parentId == undefined ||  cat.parentId == '');
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      categoryImage: cate.categoryImage,
      parentId: cate.parentId,
      imageAltText: cate.imageAltText,
      createdAt: cate.createdAt,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.name),
      imageAltText: req.body.imageAltText,
      createdBy: req.user._id,
    };
    if (req.file) {
      categoryObj.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    }

    if (
      req.body.parentId &&
      req.body.parentId !== undefined &&
      req.body.parentId !== "undefined" &&
      req.body.parentId !== ""
    ) {
      categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);

    cat.save((error, category) => {
      if (error) return res.status(400).json({ error });
      if (category) {
        return res.status(201).json({
          category,
          message: "A new category has been successfully created.",
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    const categoryList = createCategories(categories);
    // categoryList.sort((a, b) => a.customOrder - b.customOrder);
    if (categoryList) {
      res.status(200).json({
        categoryList,
      });
    } else {
      return res.status(400).json({ message: error.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { _id, name, parentId, imageAltText } = req.body;
    let categoryImage = "";

    if (req.file) {
      categoryImage = process.env.API + "/public/" + req.file.filename;
    }

    const updatedCategories = [];

    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          slug: slugify(name[i]),
        };
        if (parentId[i] !== "") {
          category.parentId = parentId[i];
        }
        if (imageAltText[i] !== "") {
          category.imageAltText = imageAltText[i];
        }
        if (categoryImage[i] !== "") {
          category.categoryImage = categoryImage[i];
        }

        const updatedCategory = await Category.findOneAndUpdate(
          { _id: _id[i] },
          category,
          { new: true }
        );
        updatedCategories.push(updatedCategory);
      }
      return res.status(201).json({ updateCategories: updatedCategories });
    } else {
      const category = {
        name,
        slug: slugify(name),
      };
      if (parentId !== "") {
        category.parentId = parentId;
      }
      if (imageAltText !== "") {
        category.imageAltText = imageAltText;
      }
      if (categoryImage !== "") {
        category.categoryImage = categoryImage;
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id },
        category,
        {
          new: true,
        }
      );
      return res.status(201).json({
        updatedCategory,
        message: "A category has been successfully updated.",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  s;
};

exports.deleteCategories = async (req, res) => {
  try {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i = 0; i < ids.length; i++) {
      const deleteCategory = await Category.findOneAndDelete({
        _id: ids[i]._id,
        createdBy: req.user._id,
      });
      deletedCategories.push(deleteCategory);
    }

    if (deletedCategories.length == ids.length) {
      res
        .status(201)
        .json({ message: "A category has been successfully deleted." });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getChildCategories = async (req, res) => {
  try {

    const category = await Category.find({}).select(
      "_id parentId name imageAltText categoryImage"
    );

    const individualCat = await Category.findOne({ _id: req.body.id });
    if (!individualCat) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subCategory = category.filter((cat) => cat.parentId == req.body.id);

    const subCategoryIds = subCategory.map((cat) => cat._id);

    const products = await Product.find({ category: { $in: subCategoryIds } });

    const subCategoryWithProductCount = subCategory.map((cat) => {
      const count = products.filter(
        (product) => product.category.toString() === cat._id.toString()
      ).length;

      return {
        _id: cat._id, // Include only the necessary properties
        name: cat.name,
        parentId: cat.parentId,
        imageAltText: cat.imageAltText,
        categoryImage: cat.categoryImage,
        customOrder: cat.customOrder,
        productCount: count,
      };
    });

    const totalProductCount = products.length;

    // Sort the subCategory array by customOrder
    // subCategoryWithProductCount.sort((a, b) => a.customOrder - b.customOrder);
    res.status(200).json({
      subCategoryList: subCategoryWithProductCount,
      totalProductCount: totalProductCount, // Adding totalProductCount to the response
      pageTitle: individualCat.name,
      parentId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      await Category.findOne({ _id: id }).exec((error, categoryById) => {
        if (error) return res.status(400).json({ error });

        res.status(200).json({ categoryById });
      });
    } else {
      return res.status(400).json({ error: "Params required" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
