// razorpayController.js
const Razorpay = require("razorpay");
//const Order = require("../models/orderModel"); // Import your Order model

const razorpay = new Razorpay({
  key_id: 'rzp_test_lUsErTdW0CPEb7',
  key_secret: 'FaV4d5kCUr65q4Ec1kmvseSo',
});

exports.createOrder = async (req, res) => {

  try {
    const options = {
      amount: req.body.totalAmount * 100, // Amount in paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// class RazorpayController {
//   static async createOrder(req, res) {
//     try {
//       // Assuming req.user is available and contains the user details
//       const user = req.user;

//       // Create the order in your database
//       const order = new Order({
//         user: user._id,
//         totalAmount: req.body.totalAmount,
//         // Other fields specific to your Order model
//         // ...

//         orderStatus: [
//           {
//             type: "ordered",
//             date: new Date(),
//             isCompleted: true,
//           },
//           {
//             type: "packed",
//             isCompleted: false,
//           },
//           {
//             type: "shipped",
//             isCompleted: false,
//           },
//           {
//             type: "delivered",
//             isCompleted: false,
//           },
//         ],
//       });

//       // Save the order to the database
//       order.save((error, savedOrder) => {
//         if (error) {
//           console.error("Error saving order to the database:", error);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }

//         // Now create the Razorpay order using the saved order details
//         const razorpayOptions = {
//           amount: savedOrder.totalAmount * 100, // Amount in paise
//           currency: "INR",
//         };

//         razorpay.orders.create(razorpayOptions, (razorpayError, razorpayOrder) => {
//           if (razorpayError) {
//             console.error("Error creating Razorpay order:", razorpayError);
//             return res.status(500).json({ error: "Internal Server Error" });
//           }

//           // Send the Razorpay order details as a response
//           res.json({ razorpayOrder, savedOrder });
//         });
//       });
//     } catch (error) {
//       console.error("Unexpected error:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   // You can define more methods for handling Razorpay callbacks, etc.
// }


