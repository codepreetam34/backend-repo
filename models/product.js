const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
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
    pincode: { type: Array, required: true },

    tags: { type: Array},

    halfkgprice: { type: String },
    onekgprice: { type: String },
    twokgprice: { type: String },

    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//     {
//         title:{type: String, required:true,unique:true},
//         desc:{type:String, required:true},
//         variantList:{type:Object,default:[]},
//         pinCode:{type:Array},
//         img:{type: Array,required:true},
//         SKU:{type: String,required:true},
//         isAdmin:{
//             type:Boolean, default:false,
//         },
//     },{timestamps: true});

//     module.exports = mongoose.model('Product',productSchema)
