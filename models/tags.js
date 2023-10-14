const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema(
  {
    tagType: String,
    categories: [String],
    options: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tags", tagsSchema);
