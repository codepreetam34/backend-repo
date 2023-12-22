const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const User = require("../models/user");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];

      const order = new Order(req.body);

      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          res.status(201).json({ order });
        }
      });
    }
  });
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items addressId")
      .populate("items.productId", "_id name productPictures")
      .sort({ _id: -1 })
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    try {
      const address = await Address.findOne({
        user: req.user._id,
      });

      if (!address || !address.address) {
        return res.status(404).json({ error: "Address not found" });
      }

      // Attach address to each order
      const ordersWithAddress = orders.map((order) => {
        const matchingAddress = address.address.find(
          (adr) => adr._id.toString() === order.addressId.toString()
        );

        return {
          ...order._doc,
          address: matchingAddress || null,
        };
      });

      res.status(200).json({
        orders: ordersWithAddress,
      });
    } catch (addressError) {
      console.error(addressError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (catchError) {
    console.error(catchError);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    // Use the `populate` method to retrieve user details for each order
    const allOrders = await Order.find().populate({
      path: 'user',
      select: 'firstName lastName email', // Specify the user fields you want to retrieve
    });

    res.status(200).json({
      allOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getOrderById = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
