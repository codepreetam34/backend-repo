const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  tagType: { type: String },
  names: { type: Array },
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [tagSchema],
    imageAltText: {
      type: String,
    },
    categoryImage: { type: String },
    parentId: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


// // Use a pre-save hook to update the tagType field in tags array based on selected tagTypes
// categorySchema.pre("save", async function (next) {
//   // Iterate through each tag in the "tags" array
//   for (const tag of this.tags) {
//     // Check if the tag type is selected in the "tagTypes" array
//     if (this.tagTypes.includes(tag.tagType)) {
//       // Update the "tagType" field in the tag with the selected tag type
//       tag.tagType = this.tagTypes.find((type) => type === tag.tagType);
//     }
//   }
//   next();
// });

// // Make sure this.tagTypes is defined
// this.tagTypes = [/* some array data */];

// categorySchema.pre("save", async function (next) {
//   for (const tag of this.tags) {
//     if (this.tagTypes && this.tagTypes.includes(tag.tagType)) {
//       tag.tagType = this.tagTypes.find((type) => type === tag.tagType);
//     }
//   }
//   next();
// });




module.exports = mongoose.model("Category", categorySchema);
