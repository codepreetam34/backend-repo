const AddToCart = require("../models/AddToCart");
const router = require("express").Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage }).array("img", 10);

//CREATE
router.post("/", upload, async (req, res) => {
  const imgUrl = req.files;
  try {
    const { title, description, price, quantity } = req.body;
      const newAddToCart = new AddToCart({
      title,
      description,
      price,
      imgage: imgUrl,
      quantity,
    });
    const savedProduct = await newAddToCart.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //UPDATE
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //DELETE
// router.delete("/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.status(200).json("Product has been deleted...");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const addToCart = await AddToCart.findById(req.params.id);
    res.status(200).json(addToCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.weight;
  try {
    let addToCart;

    if (qNew) {
        addToCart = await AddToCart.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
        addToCart = await AddToCart.find({
        weight: {
          $in: qCategory,
        },
      });
    } else {
        addToCart = await AddToCart.find();
    }

    res.status(200).json(addToCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

const getResult = async (req, res) => {
  if (req.body.img.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  const images = req.body.img.map((image) => "" + image + "").join("");

  return res.send(`Images were uploaded:${images}`);
};

module.exports = router;
