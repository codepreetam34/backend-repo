const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_lUsErTdW0CPEb7', 
  key_secret: 'FaV4d5kCUr65q4Ec1kmvseSo',
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.totalAmount * 100, // Amount in paise
      currency: 'INR',
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
