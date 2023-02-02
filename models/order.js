const mongoose = require("mongoose");
// A
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress.address",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);















// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const OrderSchema = new Schema({
//     userId: {
//         type: String,
//     },
//     items: [{
//         productId: {
//             type: String,
//         },
//         name: String,
//         quantity: {
//             type: Number,
//             required: true,
//             min: [1, 'Quantity can not be less then 1.']
//         },
//         price: Number
//     }],
//     bill: {
//         type: Number,
//         required: true
//     },
//     date_added: {
//         type: Date,
//         default: Date.now
//     }
// })

// module.exports = Order = mongoose.model('order',OrderSchema);





// // const mongoose = require("mongoose");

// // const orderSchema = new mongoose.Schema(
// //     {
// //         userId:{type: String, required:true,unique:true},
// //         products:[
// //             {
// //                 productId:{
// //                     type:String,
// //                 },
// //                 quantity:{
// //                     type:Number,
// //                     default:1,
// //                 },
// //             },
// //         ],
// //         amount: {type:Number, required:true},
// //         address:{type:Object,required:true},
// //         status:{type:String, default:"pending"},
// //     },{timestamps: true});


// //     module.exports = mongoose.model('Order',orderSchema)