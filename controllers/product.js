const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, description, category, quantity, pincode, tags, createdBy } =
    req.body;

  let productPictures = [];
  //let cakeDetails = [];


  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }

  // cakeDetails = req.cakeDetails.map((cake) => {
  //    return { weight: cake.weight, price: cake.price };
  //  });

  if (category == "63e7408c4d118f475c8542c2") {
    const product = new Product({
      name: name,
      slug: slugify(name),
      price: req.body.price ? req.body.price : req.body.halfkgprice,
      quantity,
      description,
      pincode,
      productPictures,
      category,
      halfkgprice: req.body.halfkgprice,
      onekgprice: req.body.onekgprice,
      twokgprice: req.body.twokgprice,
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
      price: req.body.price,
      quantity,
      description,
      pincode,
      productPictures,
      category,
      tags,
      createdBy: req.user._id,
    });
    product.save((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(201).json({ product, files: req.files });
      }
    });
  }
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
           else {
            res.status(200).json({ products });
          }
        });
      }
    });
};


exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select(
      "_id name price quantity slug description productPictures category pincode halfkgprice onekgprice twokgprice tags"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
