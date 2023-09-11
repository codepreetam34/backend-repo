const Category = require("../models/category");
const slugify = require("slugify");
const Product = require("../models/product");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
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
      type: cate.type,
      keyword: cate.keyword,
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
      type: req.body.type,
      keyword: req.body.keyword,
      createdBy: req.user._id,
    };

    if (req.file) {
      categoryObj.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    }

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);

    cat.save((error, category) => {
      if (error) return res.status(400).json({ error });
      if (category) {
        return res.status(201).json({ category });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = (req, res) => {
  try {
    Category.find({}).exec((error, categories) => {
      if (error) return res.status(400).json({ message: err.message });
      if (categories) {
        const categoryList = createCategories(categories);
        res.status(200).json({ categoryList });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { _id, name, parentId, type } = req.body;
    const updatedCategories = [];

    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        const category = {
          name: name[i],
          type: type[i],
          keyword: keyword[i],
          slug: slugify(name[i]),
        };
        if (parentId[i] !== "") {
          category.parentId = parentId[i];
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
        type,
        keyword: keyword,
        slug: slugify(name),
      };
      if (parentId !== "") {
        category.parentId = parentId;
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id },
        category,
        {
          new: true,
        }
      );
      return res.status(201).json({ updatedCategory });
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
      res.status(201).json({ message: "Categories removed" });
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
