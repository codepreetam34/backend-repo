const Banner = require("../models/homepageBanner");
const shortid = require("shortid");
const slugify = require("slugify");

exports.createBanner = (req, res) => {
  const { title, type, createdBy } = req.body;
  let banners = [];
  
  if (req.files.length > 0) {
    banners = req.files.map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }

  const banner = new Banner({
    title: title,
    type: type,
    slug: slugify(title),
    banners,
    createdBy: req.user._id,
  });
  banner.save((error, banner) => {
    if (error) return res.status(400).json({ error });
    if (banner) {
      res.status(201).json({ banner, files: req.files });
    }
  });
};

exports.getBannersBySlug = (req, res) => {
  const { slug } = req.params;
  //console.log(slug)
  Banner.findOne({ slug: slug })
    .select("_id banners title slug type")
    .exec((error, banner) => {
      if (error) {
        return res.status(400).json({ error });
      } else {
        res.status(200).json({ banner });
      }
    });
};

exports.getBannerById = (req, res) => {
  const { bannerId } = req.params;
  if (bannerId) {
    Banner.findOne({ _id: bannerId }).exec((error, banner) => {
      if (error) return res.status(400).json({ error });
      if (banner) {
        res.status(200).json({ banner });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteBannerById = (req, res) => {
  const { bannerId } = req.body.payload;
  if (bannerId) {
    Banner.deleteOne({ _id: bannerId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getBanners = async (req, res) => {
  const banners = await Banner.find({ createdBy: req.user._id });
  console.log(banners)
    // .select("_id title banners")
    // // .populate({ path: "category", select: "_id name" })
    // .exec();

  res.status(200).json({ banners });
};
