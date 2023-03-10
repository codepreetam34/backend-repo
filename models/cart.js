const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
        discountPrice: { type: Number },
        offer: { type: Number },
        deliveryDay: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

// // var cartSchema = new mongoose.Schema({
// //     owner: {type: mongoose.Schema.Types.ObjectID, ref: 'User'},
// //     totalPrice: {type: Number, default: 0},
// //     items: [{
// //         item: {type: mongoose.Schema.Types.ObjectID, ref: 'Product'},
// //         qty: {type: Number, default: 1},
// //         price: {type: Number, default: 0}
// //     }]})

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // const CartSchema = new Schema({
// //   userId: {
// //     type: String,
// //   },
// //   productId: {
// //     type: String,
// //   },
// //   name: { type: String },
// //   quantity: {
// //     type: Number,
// //     required: true,
// //     min: [1, "Quantity can not be less then 1."],
// //     deafult: 1,
// //   },
// //   price: { type: Number },
// //   bill: {
// //     type: Number,
// //     default: 0,
// //   },
// // });

// module.exports = Cart = mongoose.model("cart", CartSchema);
