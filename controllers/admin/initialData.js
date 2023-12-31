const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");
const HomepageBanner = require("../../models/homepageBanner");
const Slider = require("../../models/Slider");

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
      parentId: cate.parentId,
      keyword: cate.keyword,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {

  const categories = await Category.find({}).exec();

  const products = await Product.find({ createdBy: req.user._id })
    .select(
      "_id name actualPrice quantity slug description productPictures category pincode halfkgprice onekgprice twokgprice tags"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();

  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  
    const homepageBanner = await HomepageBanner.find({}) 
  
      
    const slider = await Slider.find({}) 
  
    res.status(200).json({
    categories: createCategories(categories),
    products,
    orders,
    homepageBanner,
    slider,
  });



};
