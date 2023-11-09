const UserAddress = require("../models/address");
const mongoose = require('mongoose');

exports.addAddress = (req, res) => {
  //return res.status(200).json({body: req.body})
  const { payload } = req.body;

  if (payload.address) {
    if (payload.address._id) {
      UserAddress.findOneAndUpdate(
        { user: req.user._id, "address._id": payload.address._id },
        {
          $set: {
            "address.$": payload.address,
          },
        }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    } else {
      UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            address: payload.address,
          },
        },
        { new: true, upsert: true }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    }
  } else {
    res.status(400).json({ error: "Params address required" });
  }
};

exports.getAddress = (req, res) => {
  UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
    if (error) return res.status(400).json({ error });

    if (userAddress) {
      userAddress.address.reverse();
      res.status(200).json({ userAddress });
    } else {
      res.status(404).json({ error: "No address found" });
    }
  });
};


exports.deleteAddress = (req, res) => {
  const { addressId } = req.params; // Assuming you send the addressId as a URL parameter

  if (!addressId) {
    return res.status(400).json({ error: "AddressId parameter is required" });
  }

  UserAddress.findOne({ user: req.user._id }, (error, userAddress) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (userAddress) {

      const addressObjectId = mongoose.Types.ObjectId(addressId);

      const filteredAddress = userAddress.address.find((address) => address._id.equals(addressObjectId));
    
      const updatedAddressList = userAddress.address.filter((address) => address._id != addressId);

      // Check if any addresses were removed
      if (updatedAddressList.length !== userAddress.address.length) {
        userAddress.address = updatedAddressList;

        userAddress.save((error, updatedUserAddress) => {
          if (error) {
            return res.status(400).json({ error });
          }
          res.status(200).json({ message: "Address deleted successfully", address:filteredAddress.address  });
        });
      } else {
        res.status(404).json({ error: "Address not found" });
      }
    } else {
      res.status(404).json({ error: "User's address not found" });
    }
  });
};