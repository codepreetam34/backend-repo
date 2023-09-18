const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
let sortBy = require("lodash.sortby");

exports.createProduct = async (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const {
    name,
    description,
    category,
    quantity,
    pincode,
    tags,
    actualPrice,
    discountPrice,
    deliveryDay,
    offer,
  } = req.body;

  let productPictures = [];

  // Upload product pictures
  if (req.files && req.files["productPicture"]) {
    productPictures = req.files["productPicture"].map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }

  let colors =
    req.files[`colorPicture1`] && req.files[`colorPicture1`] !== undefined
      ? req.body.colorName
      : "";
  let col =
    req.files[`colorPicture0`] && req.files[`colorPicture0`] !== undefined
      ? req.body.colorName
      : [];
  let colorDocs;

  // Store data in array before saving
  if (req.files[`colorPicture1`] !== undefined && colors !== "") {
    colorDocs = await Promise.all(
      colors?.map(async (color, index) => {
        const productPictures = await Promise.all(
          req.files[`colorPicture${index}`]?.map(async (file, i) => {
            return {
              img: process.env.API + "/public/" + file.filename,
              colorImageAltText: req.body.colorImageAltText[i] || "",
            };
          })
        );

        return {
          colorName: color,
          productPictures,
        };
      })
    );
  } else if (col && req.files[`colorPicture0`]?.length > 1) {
    colorDocs = {
      colorName: req.body.colorName ? req.body.colorName : "",
      productPictures: await Promise.all(
        req.files[`colorPicture0`]?.map(async (file, i) => {
          return {
            img: process.env.API + "/public/" + file.filename,
            colorImageAltText: req.body.colorImageAltText[i] || "",
          };
        })
      ),
    };
  } else if (col && req.files[`colorPicture0`]) {
    const filename =
      shortid.generate() + "-" + req.files[`colorPicture0`][0]?.filename;

    colorDocs = [
      {
        colorName: req.body.colorName ? req.body.colorName : "",
        productPictures: [
          {
            img: process.env.API + "/public/" + filename,
            colorImageAltText: req.body.colorImageAltText[i] || "",
          },
        ],
      },
    ];
  }

  const categoryById = await Category.findOne({ _id: category });

  if (categoryById?.name?.toLowerCase() === "cakes") {
    const product = new Product({
      name: name,
      slug: slugify(name),
      actualPrice:
        actualPrice || req.body.halfkgprice
          ? actualPrice
          : req.body.halfkgprice,
      quantity,
      description,
      pincode,
      productPictures,
      category,
      offer,
      discountPrice,
      deliveryDay,
      halfkgprice: req.body.halfkgprice ? req.body.halfkgprice : "",
      onekgprice: req.body.onekgprice ? req.body.onekgprice : "",
      twokgprice: req.body.twokgprice ? req.body.twokgprice : "",
      tags,
      createdBy: req.user._id,
    });
    product.save((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(201).json({ product, files: req.files });
      }
    });
  } else {
    const product = new Product({
      name: name,
      slug: slugify(name),
      actualPrice,
      quantity,
      description,
      pincode,
      discountPrice,
      deliveryDay,
      offer,
      productPictures,
      category,
      tags,
      createdBy: req.user._id,
    });
    product.save((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(201).json({ products: product, files: req.files });
      }
    });
  }
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  const { tag } = req.query;
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  let skip = parseInt(req.query.skip) || 5;

  console.log(page, limit);

  Category.findOne({ slug: slug })
    .select("_id keyword")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (category) {
        Product.find({ category: category._id })
          .populate({
            limit: limit,
          })
          .exec((error, products) => {
            if (error) {
              return res.status(400).json({ error });
            }

            let filterByTag = products.filter((product) =>
              product.tags.includes(tag)
            );

            let ascendingOrder = sortBy(products, "actualPrice");
            let descendingOrder = sortBy(products, "actualPrice").reverse();
            let sortedByDates = sortBy(products, "updatedAt").reverse();
            let sortedByRating = sortBy(products, "rating").reverse();

            if (products.length > 0) {
              res.status(200).json({
                products,
                filterByTag: filterByTag,
                lowToHigh: ascendingOrder,
                HighToLow: descendingOrder,
                sortedByDates: sortedByDates,
                sortedByRating: sortedByRating,
                priceRange: {
                  under500: 499,
                  under1000: 999,
                  under1500: 1499,
                  under2000: 1999,
                  above2000: 2000,
                },
                productsByPrice: {
                  under500: products.filter(
                    (product) => product.actualPrice < 500
                  ),
                  under1000: products.filter(
                    (product) =>
                      product.actualPrice > 500 && product.actualPrice <= 999
                  ),
                  under1500: products.filter(
                    (product) =>
                      product.actualPrice > 1000 && product.actualPrice <= 1499
                  ),
                  under2000: products.filter(
                    (product) =>
                      product.actualPrice > 1500 && product.actualPrice <= 1999
                  ),
                  above2000: products.filter(
                    (product) => product.actualPrice >= 2000
                  ),
                },
              });
            } else {
              res.status(200).json({ products });
            }
          });
      }
    });
};

exports.getProductDetailsById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product Id Params required" });
    }

    const product = await Product.findOne({ _id: productId }).exec();

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found for provided Product Id" });
    }

    const similarProducts = await Product.find({
      category: product.category,
    }).exec();

    res.status(200).json({ product, similarProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { productId } = req.body;
    if (productId) {
      const response = await Product.findOne({ _id: productId });
      if (response) {
        Product.deleteOne({ _id: productId }).exec((error, result) => {
          if (error) return res.status(400).json({ error });
          if (result) {
            res
              .status(202)
              .json({ message: "Delete operation done Successfully", result });
          }
        });
      } else {
        return res
          .status(400)
          .json({ error: "Delete operation fialed try again" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Product Id is required for delete operation" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function createProducts(products) {
  const productList = [];

  for (let prod of products) {
    productList.push({
      _id: prod._id,
      pincode: prod.pincode,
      tags: prod.tags,
      name: prod.name,
      quantity: prod.quantity,
      description: prod.description,
      productPictures: prod.productPictures,
      actualPrice: prod.actualPrice,
      discountPrice: prod.discountPrice,

      reviews: prod.reviews,
      rating: prod.rating,
      numReviews: prod.numReviews,

      deliveryDay: prod.deliveryDay,
      category: prod.category,
      halfkgprice: prod.halfkgprice,
      onekgprice: prod.onekgprice,
      twokgprice: prod.twokgprice,
    });
  }

  return productList;
}

exports.getProducts = async (req, res) => {
  // const limit = parseInt(req.query.limit) || 10; // Set a default of 10 items per page
  // const page = parseInt(req.query.page) || 1; // Set a default page number of 1
  try {
    const product = await Product.find({}).sort({ _id: -1 });
    //     .limit(limit)
    //     .skip(limit * page - limit);
    // const count = await Product.countDocuments().exec();
    // const totalPages = Math.ceil(count / limit);
    const products = createProducts(product);
    // let sortedByDates = sortBy(products, "updatedAt");

    if (product) {
      res.status(200).json({
        products,
    //    pagination: { currentPage: page, totalPages, totalItems: count },
      });
    } else {
      return res.status(400).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProductReview = async (req, res) => {
  const { rating, comment, name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!rating) {
    return res.status(400).json({ error: "rating is required" });
  }
  if (!comment) {
    return res.status(400).json({ error: "comment is required" });
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find((r) => {
      console.log("rrrr", r);
      return r.user.toString() === req.user._id.toString();
    });

    if (alreadyReviewed) {
      return res.status(400).json({ error: "Product already reviewed" });
    }

    const review = {
      name: name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
exports.getProductsByCategoryId = async (req, res) => {
  const { id } = req.body;
  const limit = parseInt(req.query.limit) || 20; // Set a default of 10 items per page
  const page = parseInt(req.query.page) || 1; // Set a default page number of 1
  try {
    const products = await Product.find({ category: id })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * page - limit)
      .select("_id name productPictures category");

    const count = await products.length;
    const totalPages = Math.ceil(count / limit);
    const individualCat = await Category.findOne({ _id: id });

    if (!individualCat) {
      return res.status(404).json({ message: "Category not found" });
    }
    // products.sort((a, b) => a.customOrder - b.customOrder);

    if (products) {
      res.status(200).json({
        products,
        pageTitle: individualCat.name,
        pagination: { currentPage: page, totalPages, totalItems: count },
      });
    } else {
      res.status(200).json({ products });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
