const Tags = require("../models/tags");
const Category = require("../models/category");
exports.addTags = async (req, res) => {
  try {

    const createdBy = req.user._id;
    const { tagType, categories } = req.body;
    const individualCategory = await Category.findById({ _id: tagType }).exec();

    const tagsArray = [
      {
        tagType: tagType,
        tagName: individualCategory.name,
        categories: categories.map((category) => ({
          name: category.name,
          options: category.options,
        })),
        createdBy: createdBy,
      },
    ];

    const savedTags = await Tags.create(tagsArray);

    res.status(201).json({
      message: "Tags added successfully",
      tags: savedTags,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTags = async (req, res) => {
  try {
    // Sample logic to fetch tags from the database
    const tags = await Tags.find();

    res.status(200).json({ tags: tags });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTags = async (req, res) => {
  try {
    // Extract the tag ID from the request parameters
    const tagId = req.params.tagId;

    // Sample logic to update tags in the database
    const updatedTags = await Tags.findByIdAndUpdate(tagId, req.body, { new: true });

    res.status(200).json({ message: "Tags updated successfully", tags: updatedTags });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTags = async (req, res) => {
  try {
    // Extract the tag ID from the request parameters
    const tagId = req.params.tagId;

    // Sample logic to delete tags from the database
    await Tags.findByIdAndRemove(tagId);

    res.status(200).json({ message: "Tag deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTagsById = async (req, res) => {
  try {
    // Extract the tag ID from the request parameters
    const tagId = req.params.tagId;

    // Sample logic to fetch a specific tag by ID from the database
    const tag = await Tags.findById(tagId);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ tag: tag });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
