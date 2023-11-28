const Banner = require("../models/homepageBanner");
const shortid = require("shortid");
const slugify = require("slugify");
const { S3 } = require("aws-sdk");

// Initialize AWS S3
const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});

exports.createBanner = async (req, res) => {
  try {
    const { title, imageAltText } = req.body;

    let banner = "";


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
      banner = uploadedFile.Location;
    }

    // Use shortid to generate a unique identifier
    const uniqueId = shortid.generate();

    // Combine shortid with slugify for the 'slug' field
    const slug = `${slugify(title)}-${uniqueId}`;

    const bannerData = new Banner({
      title: title,
      slug: slug,
      banner,
      imageAltText,
      createdBy: req.user._id,
    });

    bannerData.save((error, bannerImage) => {
      if (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: `Duplicate key error. Slug '${slug}' must be unique.` });
        }
        return res.status(400).json({ message: error.message });
      }
      if (bannerImage) {
        res.status(201).json({ banners: bannerImage, files: req.files, message: "Banner has been added successfully" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { _id, title, imageAltText } = req.body;

    const bannerData = {
      createdBy: req.user._id,
    };

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
      bannerData.banner = uploadedFile.Location;
    }

    if (title != undefined) {
      // Use shortid to generate a unique identifier
      const uniqueId = shortid.generate();
      // Combine shortid with slugify for the 'slug' field
      const slug = `${slugify(title)}-${uniqueId}`;
      bannerData.title = title;
      bannerData.slug = slug;
    }

    if (imageAltText != undefined) {
      bannerData.imageAltText = imageAltText;
    }
    const updatedBanner = await Banner.findOneAndUpdate({ _id }, bannerData, {
      new: true,
    });
    return res.status(201).json({ updatedBanner, message: "Banner has been updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBannersBySlug = (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBannerById = (req, res) => {
  try {
    const { bannerId } = req.params;
    if (bannerId) {
      Banner.findOne({ _id: bannerId }).exec((error, banner) => {
        if (error) return res.status(400).json({ error });
        if (banner) {

          res.status(200).json({ banner });
        }
      });
    } else {
      return res.status(400).json({ message: "Params required" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// new update
exports.deleteBannerById = async (req, res) => {
  try {
    const { bannerId } = req.body;
    if (bannerId) {
      const response = await Banner.findOne({ _id: bannerId });
      if (response) {
        if (response.banner) {
          const key = response.banner.split("/").pop();
          const deleteParams = {
            Bucket: "vibezter-spaces", // Replace with your DigitalOcean Spaces bucket name
            Key: key,
          };
          await s3.deleteObject(deleteParams).promise();
        }
        Banner.deleteOne({ _id: bannerId }).exec((error, result) => {
          if (error) return res.status(400).json({ error });
          if (result) {
            res.status(202).json({ result, message: "Banner has been deleted successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ message: "Banner Id is required" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBanners = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Set a default of 10 items per page
  const page = parseInt(req.query.page) || 1; // Set a default page number of 1

  try {
    const banners = await Banner
      .find({})
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * page - limit);

    const count = await Banner.countDocuments().exec();
    const totalPages = Math.ceil(count / limit);

    if (banners) {
      res.status(200).json({
        homePageBanners: banners,
        pagination: { currentPage: page, totalPages, totalItems: count },
      });
    } else {
      return res.status(400).json({ message: error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


