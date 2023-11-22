const express = require("express");
const {
  addItemToCart,
  getCartItems,
  removeCartItems,
} = require("../controllers/cart");
const { requireSignin, userMiddleware } = require("../common-middleware");
const router = express.Router();

router.post(
  "/user/cart/addtocart",
  requireSignin,
  userMiddleware,
  addItemToCart
);
//router.post('/user/cart/addToCartByLogin', requireSignin, userMiddleware, addToCart);

router.post("/user/cart/getCartItems", requireSignin, getCartItems);

//new update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  removeCartItems
);

module.exports = router;

