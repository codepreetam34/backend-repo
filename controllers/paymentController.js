const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_live_Sr8STvqtnDkQcQ', 
  key_secret: 'JgZQGZUCp5JQqv2QuxqCgdF7',
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
