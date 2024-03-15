const Product = require("../models/product");
const VendorProduct = require("../models/vendorProducts");
const Order = require("../models/order");
const Category = require("../models/category");
let sortBy = require("lodash.sortby");
const { S3 } = require("aws-sdk");
const shortid = require("shortid");
const slugify = require("slugify");

// Initialize AWS S3
const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      pincode,
      actualPrice,
      discountPrice,
      specifications,
      halfkgprice,
      onekgprice,
      twokgprice,
      deliveryDay,
      offer,
      tags,
    } = req.body;

    let productPictures = [];

    if (req.files) {
      productPictures = await Promise.all(
        req.files.map(async (file, index) => {
          const fileContent = file.buffer;
          const filename = shortid.generate() + "-" + file.originalname;
          const uploadParams = {
            Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
            Key: filename,
            Body: fileContent,
            ACL: "public-read",
          };

          // Upload the product picture to DigitalOcean Spaces
          const uploadedFile = await s3.upload(uploadParams).promise();

          return {
            img: uploadedFile.Location,
            imageAltText:
              (req.body.imageAltText && req.body.imageAltText[index]) || "",
          };
        })
      );
    }

    const categoryById = await Category.findOne({ _id: category });

    if (categoryById?.name?.toLowerCase() === "cakes") {
      const product = new Product({
        name,
        slug: slugify(name),
        actualPrice: actualPrice || halfkgprice || 0,
        quantity,
        description,
        pincode,
        productPictures,
        category,
        offer,
        discountPrice,
        deliveryDay,
        specifications,
        halfkgprice: halfkgprice || "",
        onekgprice: onekgprice || "",
        twokgprice: twokgprice || "",
        tags: JSON.parse(tags),
        categoryName: categoryById?.name,
        createdBy: req.user._id,
      });

      const savedProduct = await product.save();

      if (savedProduct) {
        return res.status(201).json({
          product: savedProduct,
          files: req.files,
          message: "Product has been added successfully",
        });
      }
    } else {
      const product = new Product({
        name,
        slug: slugify(name),
        actualPrice,
        quantity,
        description,
        pincode,
        discountPrice,
        deliveryDay,
        offer,
        productPictures,
        specifications,
        category,
        tags: JSON.parse(tags),
        categoryName: categoryById?.name,
        createdBy: req.user._id,
      });

      const savedProduct = await product.save();

      if (savedProduct) {
        return res.status(201).json({
          product: savedProduct,
          files: req.files,
          message: "Product has been added successfully",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.createVendorProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      pincode,
      actualPrice,
      discountPrice,
      specifications,
      halfkgprice,
      onekgprice,
      twokgprice,
      deliveryDay,
      offer,
      tags,
    } = req.body;

    let productPictures = [];

    if (req.files) {
      productPictures = await Promise.all(
        req.files.map(async (file, index) => {
          const fileContent = file.buffer;
          const filename = shortid.generate() + "-" + file.originalname;
          const uploadParams = {
            Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
            Key: filename,
            Body: fileContent,
            ACL: "public-read",
          };

          // Upload the product picture to DigitalOcean Spaces
          const uploadedFile = await s3.upload(uploadParams).promise();

          return {
            img: uploadedFile.Location,
            imageAltText:
              (req.body.imageAltText && req.body.imageAltText[index]) || "",
          };
        })
      );
    }

    const categoryById = await Category.findOne({ _id: category });

    if (categoryById?.name?.toLowerCase() === "cakes") {
      const product = new VendorProduct({
        name,
        slug: slugify(name),
        actualPrice: actualPrice || halfkgprice || 0,
        quantity,
        description,
        pincode,
        productPictures,
        category,
        offer,
        discountPrice,
        deliveryDay,
        specifications,
        halfkgprice: halfkgprice || "",
        onekgprice: onekgprice || "",
        twokgprice: twokgprice || "",
        tags: JSON.parse(tags),
        categoryName: categoryById?.name,
        createdBy: req.user._id,
      });

      const savedProduct = await product.save();

      if (savedProduct) {
        return res.status(201).json({
          product: savedProduct,
          files: req.files,
          message: "Product has been added successfully",
        });
      }
    } else {
      const product = new VendorProduct({
        name,
        slug: slugify(name),
        actualPrice,
        quantity,
        description,
        pincode,
        discountPrice,
        deliveryDay,
        offer,
        productPictures,
        specifications,
        category,
        tags: JSON.parse(tags),
        categoryName: categoryById?.name,
        createdBy: req.user._id,
      });

      const savedProduct = await product.save();

      if (savedProduct) {
        return res.status(201).json({
          product: savedProduct,
          files: req.files,
          message: "Product has been added successfully",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.getVendorProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const product = await VendorProduct.find({ createdBy: userId }).sort({ _id: -1 });
    const products = await createProducts(product);

    if (products) {
      res.status(200).json({
        products,
      });
    } else {
      return res.status(400).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  const { tag } = req.query;
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  let skip = parseInt(req.query.skip) || 5;

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
    const categoryName = await Category.findById({ _id: product.category });

    res
      .status(200)
      .json({ product, similarProducts, categoryName: categoryName.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (productId) {
      const response = await Product.findOne({ _id: productId });

      if (response) {
        response.productPictures.map(async (banner) => {
          if (banner.img) {
            const key = banner.img.split("/").pop();
            const deleteParams = {
              Bucket: "vibezter-spaces",
              Key: key,
            };

            const resDelete = await s3.deleteObject(deleteParams).promise();

            if (resDelete) {
              Product.deleteOne({ _id: productId }).exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                  res
                    .status(202)
                    .json({ message: "Product has been deleted successfully" });
                }
              });
            } else {
              return res
                .status(400)
                .json({ error: "Delete operation failed try again" });
            }
          }
        });
      } else {
        return res
          .status(400)
          .json({ error: "Delete operation failed try again" });
      }
    } else {
      res.status(400).json({ error: "Params required" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function createProducts(products) {
  const productList = [];
  for (let prod of products) {
    let category = await Category.findOne({ _id: prod.category });
    let categoryName = category?.name || "";

    if (categoryName && categoryName.toLowerCase() == "cakes") {
      // Use categoryName here for comparison
      productList.push({
        _id: prod._id,
        pincode: prod.pincode,
        tags: prod.tags,
        name: prod.name,
        quantity: prod.quantity,
        description: prod.description,
        specifications: prod.specifications,
        offer: prod.offer,
        productPictures: prod.productPictures,
        actualPrice: prod.actualPrice,
        discountPrice: prod.discountPrice,
        reviews: prod.reviews,
        rating: prod.rating,
        numReviews: prod.numReviews,
        categoryName: prod.categoryName,
        deliveryDay: prod.deliveryDay,
        category: prod.category,
        halfkgprice: prod.halfkgprice,
        onekgprice: prod.onekgprice,
        twokgprice: prod.twokgprice,
        categoryName: categoryName,
      });
    } else {
      productList.push({
        _id: prod._id,
        pincode: prod.pincode,
        tags: prod.tags,
        name: prod.name,
        quantity: prod.quantity,
        description: prod.description,
        specifications: prod.specifications,
        offer: prod.offer,
        productPictures: prod.productPictures,
        actualPrice: prod.actualPrice,
        discountPrice: prod.discountPrice,
        reviews: prod.reviews,
        rating: prod.rating,
        numReviews: prod.numReviews,
        categoryName: prod.categoryName,
        deliveryDay: prod.deliveryDay,
        category: prod.category,
        categoryName: categoryName,
      });
    }
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
    const products = await createProducts(product);
    // let sortedByDates = sortBy(products, "updatedAt");

    if (products) {
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
  try {
    const { rating, comment, name } = req.body;

    if (!name || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "name, rating, and comment are required" });
    }

    const { _id: profilePicture } = req.user;
    const userData = await User.find({ _id: req.user._id }).sort({ _id: -1 });

    let image = "";
    if (req.file) {
      const fileContent = req.file.buffer;
      const filename = shortid.generate() + "-" + req.file.originalname;
      const uploadParams = {
        Bucket: "vibezter-spaces",
        Key: filename,
        Body: fileContent,
        ACL: "public-read",
      };
      const uploadedFile = await s3.upload(uploadParams).promise();
      image = uploadedFile.Location;
    }

    const product = await Product.findById(req.body.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update the existing review
      product.reviews[existingReviewIndex] = {
        name,
        rating: Number(rating),
        comment,
        image,
        profilePicture: userData.profilePicture,
        user: req.user._id,
      };
    } else {
      // Add a new review
      const newReview = {
        name,
        rating: Number(rating),
        comment,
        image,
        profilePicture: userData.profilePicture,
        user: req.user._id,
      };

      product.reviews.push(newReview);
    }

    const totalRating = product.reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );
    product.numReviews = product.reviews.length;
    product.rating = totalRating / product.numReviews;

    await product.save();

    return res.status(201).json({ message: "Review added/updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProductReview = async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.user._id;

    // Find the product with the specified ID and user's review
    const productWithUserReview = await Product.findOne({
      _id: productId,
      "reviews.user": userId,
    });

    if (!productWithUserReview) {
      return res.status(200).json({
        message: "Product or review not found for the user",
        purchased: false,
      });
    }

    // Extract the user's review for the product
    const userReview = productWithUserReview.reviews.find((review) =>
      review.user.equals(userId)
    );

    return res.status(200).json({
      userReview,
      message: "Product already reviewed !",
      purchased: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkProductPurchase = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has purchased the product
    const userOrder = await Order.findOne({
      user: req.user._id,
      "items.productId": req.params.productId,
      paymentStatus: "completed",
    });

    if (userOrder) {
      return res
        .status(200)
        .json({ purchased: true, message: "You have purchased the product." });
    } else {
      return res.status(200).json({
        purchased: false,
        message: "You have not purchased the product.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      pincode,
      tags,
      actualPrice,
      discountPrice,
      specifications,
      deliveryDay,
      offer,
      _id,
    } = req.body;
    let productPictures = [];

    if (req.files && req.files.length > 0) {
      productPictures = await Promise.all(
        req.files.map(async (file, index) => {
          const fileContent = file.buffer;
          const filename = shortid.generate() + "-" + file.originalname;
          const uploadParams = {
            Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
            Key: filename,
            Body: fileContent,
            ACL: "public-read",
          };

          // Upload the product picture to DigitalOcean Spaces
          const uploadedFile = await s3.upload(uploadParams).promise();

          return {
            img: uploadedFile.Location,
            imageAltText:
              (req.body.imageAltText && req.body.imageAltText[index]) || "",
          };
        })
      );
    }

    const categoryById = await Category.findOne({ _id: category });

    const updateObject = {};

    // Check and add properties to the updateObject if they are not empty or undefined
    if (name !== undefined && name !== "") {
      updateObject.name = name;
      updateObject.slug = slugify(name);
    }

    if (actualPrice !== undefined) {
      updateObject.actualPrice = actualPrice;
    }

    if (quantity !== undefined) {
      updateObject.quantity = quantity;
    }

    if (description !== undefined && description !== "") {
      updateObject.description = description;
    }

    if (pincode !== undefined) {
      updateObject.pincode = pincode;
    }
    if (specifications !== undefined) {
      updateObject.specifications = specifications;
    }
    if (productPictures.length > 0) {
      updateObject.productPictures = productPictures;
    }

    if (category !== undefined) {
      updateObject.category = category;
    }

    if (offer !== undefined) {
      updateObject.offer = offer;
    }

    if (discountPrice !== undefined) {
      updateObject.discountPrice = discountPrice;
    }

    if (deliveryDay !== undefined) {
      updateObject.deliveryDay = deliveryDay;
    }

    if (tags !== undefined) {
      updateObject.tags = JSON.parse(tags);
    }

    if (
      categoryById?.name?.toLowerCase() == "cakes" ||
      categoryById?.name?.toLowerCase() == "cake"
    ) {
      // Add properties specific to cake category
      if (req.body.halfkgprice !== undefined) {
        updateObject.halfkgprice = req.body.halfkgprice;
      }
      if (req.body.onekgprice !== undefined) {
        updateObject.onekgprice = req.body.onekgprice;
      }
      if (req.body.twokgprice !== undefined) {
        updateObject.twokgprice = req.body.twokgprice;
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id },
      updateObject,
      {
        new: true,
      }
    );
    if (updatedProduct) {
      return res.status(200).json({
        updatedProduct,
        message: "Product has been updated successfully",
      });
    } else {
      return res.status(400).json({ error: "Failed to update product" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to update product", err });
  }
};

exports.getProductsBySorting = async (req, res) => {
  try {
    const { sort, categoryId, pageInfo, tagName, pincodeData } = req.body;
    const products = await Product.find({ category: categoryId });

    const individualCat = await Category.findOne({ _id: categoryId });

    if (!individualCat) {
      return res.status(404).json({ message: "Category not found" });
    }

    let filteredProd = products;
    if (!filteredProd) {
      return res.status(400).json({ error: "Failed to fetch products" });
    }
    if (pincodeData) {
      filteredProd = filteredProd.filter((product) =>
        product.pincode.includes(pincodeData)
      );
    }

    // Step 3: Filter products by tagName

    if (pageInfo == "productPage") {
      const filteredProducts = filteredProd.filter((product) => {
        return product.tags.some((tag) => tag.names.includes(tagName));
      });
      if (filteredProducts) {
        let sortedProducts;
        if (sort == "Price: Low to High") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sort == "Price: High to Low") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => b.discountPrice - a.discountPrice);
        } else if (sort == "New to Old") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sort == "Old to New") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        } else {
          // Default sorting is by the latest products (original sorting).
          sortedProducts = filteredProducts;
        }
        return res.status(200).json({
          categoryId: categoryId,
          categoryName: individualCat.name,
          pageTitle: tagName ? tagName : individualCat.name,
          tagName: tagName,
          sortedProducts: sortedProducts,
        });
      } else {
        return res.status(400).json({ error: "Failed to fetch products" });
      }
    } else {
      if (tagName) {
        const filteredProducts = filteredProd.filter((product) => {
          return product.tags.some((tag) => tag.names.includes(tagName));
        });

        let sortedProducts;
        if (sort == "Price: Low to High") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sort == "Price: High to Low") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => b.discountPrice - a.discountPrice);
        } else if (sort == "New to Old") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sort == "Old to New") {
          sortedProducts = filteredProducts
            .slice()
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        } else {
          // Default sorting is by the latest products (original sorting).
          sortedProducts = filteredProducts;
        }

        return res.status(200).json({
          categoryId: categoryId,
          categoryName: individualCat.name,
          pageTitle: tagName ? tagName : individualCat.name,
          tagName: tagName,
          sortedProducts: sortedProducts,
        });
      } else {
        let sortedProducts;
        if (sort == "Price: Low to High") {
          sortedProducts = filteredProd
            .slice()
            .sort((a, b) => a.discountPrice - b.discountPrice);
        } else if (sort == "Price: High to Low") {
          sortedProducts = filteredProd
            .slice()
            .sort((a, b) => b.discountPrice - a.discountPrice);
        } else if (sort == "New to Old") {
          sortedProducts = filteredProd
            .slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (sort == "Old to New") {
          sortedProducts = filteredProd
            .slice()
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        } else {
          // Default sorting is by the latest products (original sorting).
          sortedProducts = filteredProd;
        }

        return res.status(200).json({
          categoryId: categoryId,
          categoryName: individualCat.name,
          pageTitle: tagName ? tagName : individualCat.name,
          tagName: tagName,
          sortedProducts: sortedProducts,
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ error: "Failed to fetch products" });
  }
};

// getProductsByCategoryId
exports.getProductsByCategoryId = async (req, res) => {
  try {
    const { id, pincodeData } = req.body;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;

    const [products, count] = await Promise.all([
      Product.find({ category: id })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(limit * page - limit),
      Product.countDocuments({ category: id }),
    ]);

    const totalPages = Math.ceil(count / limit);
    const individualCat = await Category.findOne({ _id: id });

    if (!individualCat) {
      return res.status(404).json({ message: "Category not found" });
    }

    let responseProducts = products;

    if (pincodeData) {
      responseProducts = responseProducts.filter((product) =>
        product.pincode.includes(pincodeData)
      );
    }

    res.status(200).json({
      products: responseProducts,
      categoryId: id,
      pageTitle: individualCat?.name,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: responseProducts.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// getProductsByTag
exports.getProductsByTag = async (req, res) => {
  try {
    const { categoryId, tagName, sort, pincodeData } = req.body;
    const allProducts = await Product.find({ category: categoryId });
    const individualCat = await Category.findOne({ _id: categoryId });

    if (allProducts.length <= 0 || !individualCat) {
      return res.status(200).json({
        products: [],
        categoryId: categoryId,
        categoryName: individualCat?.name ? individualCat?.name : "",
        pageTitle: tagName,
        tagName: tagName,
      });
    }

    let filteredProducts = allProducts;

    if (pincodeData) {
      filteredProducts = filteredProducts.filter((product) =>
        product.pincode.includes(pincodeData)
      );
    }

    filteredProducts = filteredProducts.filter((product) =>
      product.tags.some((tag) => tag.names.includes(tagName))
    );

    if (filteredProducts) {
      const sortOptions = {
        "Price: Low to High": "discountPrice",
        "Price: High to Low": "discountPrice",
        "New to Old": "updatedAt",
        "Old to New": "updatedAt",
      };

      const sortedProducts = sort
        ? filteredProducts.slice().sort((a, b) => {
            const key = sortOptions[sort] || sortOptions["New to Old"];
            return sort === "High to Low" ? b[key] - a[key] : a[key] - b[key];
          })
        : filteredProducts;

      res.status(200).json({
        categoryId: categoryId,
        categoryName: individualCat?.name,
        pageTitle: tagName,
        tagName: tagName,
        products: sortedProducts,
      });
    } else {
      return res.status(400).json({ error: "Failed to fetch products" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Failed to fetch products" });
  }
};

exports.getProductsByTopCategory = async (req, res) => {
  try {
    const product = await Product.find({}).sort({ _id: -1 });
    const products = await createProducts(product);
    const filteredProducts = products.filter((product) =>
      product.tags.some((tag) => tag.names.includes("Top Category"))
    );
    if (products) {
      res.status(200).json({ products: filteredProducts });
    } else {
      return res.status(400).json({ error: "No products found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByBestSeller = async (req, res) => {
  try {
    // Fetch all products and sort them by _id in descending order
    const allProducts = await Product.find({}).sort({ _id: -1 });

    // Assuming createProducts is a function to format the products
    const formattedProducts = await createProducts(allProducts);

    // Filter products with the "Best Seller" tag
    const bestSellerProducts = formattedProducts.filter((product) =>
      product.tags.some((tag) => tag.names.includes("Best Sellers"))
    );

    if (bestSellerProducts.length > 0) {
      res.status(200).json({ products: bestSellerProducts });
    } else {
      return res.status(404).json({ error: "No best-selling products found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByTagOnly = async (req, res) => {
  try {
    const { tagName, pincodeData } = req.body;
    const allProducts = await Product.find();
    if (allProducts.length <= 0) {
      return res.status(200).json({
        products: [],
        pageTitle: tagName,
        tagName: tagName,
      });
    }

    let filteredProducts = allProducts;

    if (pincodeData) {
      filteredProducts = filteredProducts.filter((product) =>
        product.pincode.includes(pincodeData)
      );
    }

    filteredProducts = filteredProducts.filter((product) =>
      product.tags.some((tag) => tag.names.includes(tagName))
    );

    if (filteredProducts) {
      res.status(200).json({
        pageTitle: tagName,
        tagName: tagName,
        products: filteredProducts,
      });
    } else {
      return res.status(400).json({ message: "Failed to fetch products" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Failed to fetch products" });
  }
};
