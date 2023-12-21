const { requireSignin, userMiddleware } = require("../common-middleware");
const { addOrder, getOrders, getOrderById } = require("../controllers/order");
const router = require("express").Router();

router.post("/order/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/order/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/order/getOrderById", requireSignin, userMiddleware, getOrderById);

module.exports = router;

// const { Router } = require('express');
// const orderController = require('../controllers/orderControllers');
// const router = Router();

// router.get('/order/:id',orderController.get_orders);
// router.post('/order/:id',orderController.checkout);

// module.exports = router;
