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
      amount: req.body.totalAmount * 100, // Amount in paise
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
    const amount = req.body.amount || "1.00"; // Default amount if not provided

    // Construct Paytm API request parameters
    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: paytmConfig.MID, // Your Paytm Merchant ID
        websiteName: paytmConfig.WEBSITE, // Your Paytm Website Name
        orderId: orderId,
        callbackUrl: paytmConfig.CALLBACK_URL, // Your callback URL
        txnAmount: {
          value: amount,
          currency: "INR",
        },
        userInfo: {
          custId: "CUST_001",
        },
      },
    };

    // Generate Paytm signature
    const checksum = await generatePaytmSignature(paytmParams.body);

    // Include the signature in the request
    paytmParams.head = {
      signature: checksum,
    };
    console.log("checksum ", checksum);
    // Make the API request to initiate the Paytm transaction
    const response = await axios.post(
      `https://${paytmConfig.ENV}/theia/api/v1/initiateTransaction?mid=${paytmConfig.MID}&orderId=${orderId}`,
      paytmParams,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paytm API Response:", response.data);
    // Check if the response contains the expected structure
    if (response.data && response.data.body && response.data.body.txnToken) {
      // Extract the payment URL from the response
      const paymentUrl = response.data.body.txnToken;

      // Send the payment URL to the client
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
    console.log("postbodyjson 1", postbodyjson);
    const checksum = postbodyjson.CHECKSUMHASH;
    console.log("checksum 2 ", checksum);
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
    // Convert the JSON body to a string
    const requestBody = JSON.stringify(body);

    // Generate the Paytm signature using the PaytmChecksum class
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
