const User = require("../models/user");
const shortid = require("shortid");
const { S3 } = require("aws-sdk");

const s3 = new S3({
  endpoint: "https://vibezter-spaces.blr1.digitaloceanspaces.com",
  accessKeyId: "DO00XDVVVLMUEJCKADRM",
  secretAccessKey: "SIFlABu43WE1DvoOHi87bmZmykG0ECL+6t5+O+qBacU",
  s3ForcePathStyle: true,
});

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const _id = req.body.id;
    const response = await User.findOne({ _id });
    if (response?.profilePicture) {
      const key = response?.profilePicture.split("/").pop();
      const deleteParams = {
        Bucket: "vibezter-spaces",
        Key: key,
      };

      await s3.deleteObject(deleteParams).promise();
    }
    const deletedUser = await User.findOneAndDelete({ _id });

    if (deletedUser) {
      res.status(200).json({
        message: `User ${response.email} has been successfully deleted.`,
      });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { firstName, lastName, gender, contactNumber, dob, email, role, _id } =
    req.body;
  try {
    const newUser = {};

    if (firstName) {
      newUser.firstName = firstName;
    }

    if (lastName) {
      newUser.lastName = lastName;
    }

    if (email) {
      newUser.email = email;
    }

    if (role) {
      newUser.role = role;
    }

    if (gender) {
      newUser.gender = gender;
    }

    if (contactNumber) {
      newUser.contactNumber = contactNumber;
    }

    if (dob) {
      newUser.dob = dob;
    }

    if (req.file) {
      const fileContent = req.file.buffer;
      const filename = shortid.generate() + "-" + req.file.originalname;
      const uploadParams = {
        Bucket: "vibezter-spaces",
        Key: filename,
        Body: fileContent,
        ACL: "public-read",
      };
      const uploadedFile = await s3.upload(uploadParams).promise();
      newUser.profilePicture = uploadedFile.Location;
    }

    const userResponse = await User.findOneAndUpdate({ _id }, newUser, {
      new: true,
    });

    if (!userResponse) {
      return res.status(404).json({ message: "User not found after update" });
    }

    res.json({ message: "Profile updated successfully", user: userResponse });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
