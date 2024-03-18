const axios = require("axios");
const paytmConfig = require("../config/paytmConfig");
const PaytmChecksum = require("./PaytmChecksum");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_lUsErTdW0CPEb7",
  key_secret: "FaV4d5kCUr65q4Ec1kmvseSo",
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.totalAmount * 100, 
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.paytmInitiateTransaction = async (req, res) => {
  try {
    const orderId = "Ord_" + Date.now();
    const amount = req.body.amount || "1.00"; 

    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: paytmConfig.MID, 
        websiteName: paytmConfig.WEBSITE, 
        orderId: orderId,
        callbackUrl: paytmConfig.CALLBACK_URL, 
        txnAmount: {
          value: amount,
          currency: "INR",
        },
        userInfo: {
          custId: "CUST_001",
        },
      },
    };

    const checksum = await generatePaytmSignature(paytmParams.body);

    paytmParams.head = {
      signature: checksum,
    };
    const response = await axios.post(
      `https://${paytmConfig.ENV}/theia/api/v1/initiateTransaction?mid=${paytmConfig.MID}&orderId=${orderId}`,
      paytmParams,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.body && response.data.body.txnToken) {
      const paymentUrl = response.data.body.txnToken;

      const data = {
        env: paytmConfig.ENV,
        mid: paytmConfig.MID,
        amount: amount,
        orderId: orderId,
        paymentUrl: paymentUrl,
      };

      res.status(200).json({ paymentUrl, data });
    } else {
      console.error("Invalid Paytm API response:", response.data);
      res.status(500).json({ error: "Invalid Paytm API response" });
    }
  } catch (error) {
    console.error("Error creating Paytm order:", error);
    res.status(500).json({ error: "Error creating Paytm order" });
  }
};

exports.paytmCallBack = async (req, res) => {
  try {
    const postbodyjson = req.body;
    const checksum = postbodyjson.CHECKSUMHASH;
    delete postbodyjson["CHECKSUMHASH"];

    const verifyChecksum = PaytmChecksum.verifySignature(
      postbodyjson,
      paytmConfig.MKEY,
      checksum
    );
    if (verifyChecksum) {
      res.status(200).json({ verifySignature: "true", data: postbodyjson });
      // res.render(__dirname + "/callback.html", {
      //   verifySignature: "true",
      //   data: postbodyjson,
      // });
    } else {
      res.status(200).json({ verifySignature: "false", data: postbodyjson });
      // res.render(__dirname + "/callback.html", {
      //   verifySignature: "false",
      //   data: postbodyjson,
      // });
    }
  } catch (error) {
    console.error("Error processing Paytm callback:", error);
    res.status(500).json({ error: "Error processing Paytm callback" });
  }
};

async function generatePaytmSignature(body) {
  try {
    const requestBody = JSON.stringify(body);
    const signature = await PaytmChecksum.generateSignature(
      requestBody,
      paytmConfig.MKEY
    );

    return signature;
  } catch (error) {
    console.error("Error generating Paytm signature:", error);
    throw error;
  }
}
