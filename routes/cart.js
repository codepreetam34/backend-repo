const express = require("express");
const {
  addItemToCart,
  addToCart,
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
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
//new update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;




// // router.post("/product/:id/addCart", async (req, res) => {
// //     const quantity = req.body;
// //     Product.findById(req.params.id, function(err, foundProduct){
// //         if(err){
// //             console.log(err);
// //         }
// //         const product = {
// //             item: foundProduct._id,
// //             qty: quantity,
// //             price: foundProduct.price * quantity 
// //         }
// //         Cart.owner = req.user._id;
// //         Cart.itmes.push(product);
// //         Cart.save();
// //         res.redirect("/cart");
// //     })
// //     })
    
// //     router.get("/cart", function(req, res){
// //         Cart.find({owner: req.user._id}, function(err, userCart){
// //             if(err){
// //                 console.log(err);
// //             }
// //             const pPrice = userCart.items.map(p => p.price);
// //             const totalPrice = pPrice.reduce((a, b) => a + b, 0);
// //             userCart.totalPrice = totalPrice;
// //             userCart.save()
// //             res.render("cart", {cart: userCart});
// //         })
// //     })

// const { Router } = require('express');
// const cartController = require('../controllers/cartControllers');
// const router = Router();

// router.get('/cart/:id',cartController.get_cart_items);
// router.post('/cart/:id',cartController.add_cart_item);
// router.put('/cart/:id',cartController.update_cart_item);
// router.delete('/cart/:userId/:itemId',cartController.delete_item);

// // module.exports = router;