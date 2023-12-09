const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema(
  {
    tagType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tagName: {
      type: String,
      required: true,
    },
    categories: [
      {
        name: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tags", tagsSchema);
