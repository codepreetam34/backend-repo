const { requireSignin, userMiddleware } = require("../common-middleware");
const { addOrder, getOrders, getOrder } = require("../controllers/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;






























// const { Router } = require('express');
// const orderController = require('../controllers/orderControllers');
// const router = Router();

// router.get('/order/:id',orderController.get_orders);
// router.post('/order/:id',orderController.checkout);

// module.exports = router;