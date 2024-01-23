const UserAddress = require("../models/address");
const mongoose = require("mongoose");

exports.addAddress = (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ error: "Params address required" });
  }
};

exports.getAddress = (req, res) => {
  try {
    UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
      if (error) return res.status(400).json({ error });
      if (userAddress) {
        userAddress.address.reverse();
        res.status(200).json({ userAddress });
      } else {
        res.status(404).json({ message: "No address found" });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error !! Please try again" });
  }
};

exports.deleteAddress = (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ error: "AddressId parameter is required" });
    }

    UserAddress.findOne({ user: req.user._id }, (error, userAddress) => {
      if (error) {
        return res
          .status(400)
          .json({ message: "Internal Server Error !! Please try again" });
      }

      if (userAddress) {
        const addressObjectId = mongoose.Types.ObjectId(addressId);

        const filteredAddress = userAddress.address.find((address) =>
          address._id.equals(addressObjectId)
        );

        const updatedAddressList = userAddress.address.filter(
          (address) => address._id != addressId
        );

        if (updatedAddressList.length !== userAddress.address.length) {
          userAddress.address = updatedAddressList;

          userAddress.save((error, updatedUserAddress) => {
            if (error) {
              return res.status(400).json({ error });
            }
            res.status(200).json({
              message: "Address deleted successfully",
              address: filteredAddress.address,
            });
          });
        } else {
          res.status(404).json({ message: "Address not found" });
        }
      } else {
        res.status(404).json({ message: "User's address not found" });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error !! Please try again" });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const userAddress = await UserAddress.findOne({ user: req.user._id });

    if (!userAddress) {
      return res.status(404).json({ message: "User's address not found" });
    }

    // Set the selected address as default
    userAddress.address.forEach((address) => {
      address.isDefault = address._id.toString() === addressId;
    });

    // Save the updated user address
    const updatedUserAddress = await userAddress.save();

    res.status(200).json({
      message: "Default address set successfully",
      userAddress: updatedUserAddress,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error !! Please try again" });
  }
};
