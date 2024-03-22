const {
  requireSignin,
  userMiddleware,
  adminMiddleware,
} = require("../common-middleware");
const {
  addOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  getVendorOrders,
} = require("../controllers/order");
const router = require("express").Router();

router.post("/order/addOrder", requireSignin, addOrder);
router.get("/order/getOrders", requireSignin, getOrders);
router.get("/order/getAllOrders", requireSignin, getAllOrders);
router.post("/order/getOrderById", requireSignin, getOrderById);
router.post("/order/getVendorOrders", requireSignin, getVendorOrders);

module.exports = router;

// const { Router } = require('express');
// const orderController = require('../controllers/orderControllers');
// const router = Router();

// router.get('/order/:id',orderController.get_orders);
// router.post('/order/:id',orderController.checkout);

// module.exports = router;
