const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const UserAccount = require("../Model/UserAccount");
const SongData = require("../Model/SongData");

const {
  verifyToken,
  verifiedUserEmail,
} = require("../Authentiation/verification");

router.post(
  "/change-user-type",
  verifyToken,
  verifiedUserEmail,
  async (req, res) => {
    try {
      let userType = req.body.userType;
      const UID = req.cookies.UID;

      let User = await UserAccount.findOne({ _id: UID });

      User.userType = userType;

      await User.save();

      res.send("Updated");
    } catch (error) {
      console.log(error);
      res.send("Error");
    }
  }
);
router.post(
  "/change-user-data",
  verifyToken,
  verifiedUserEmail,
  async (req, res) => {
    try {
        console.log("running API ---> ", req.body);
      const newUserName = req.body.username;
      const newPassword = req.body.password;
      const UID = req.cookies.UID;
      let User = await UserAccount.findOne({ _id: UID });
      User.name = newUserName;
      if (newPassword) {
        console.log("running hash ---> ", newPassword);
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        User.password = hashedNewPassword;
      }
      // password update logic here
      await User.save();

      res.send("Updated");
    } catch (error) {
      console.log(error);
      res.send("Error");
    }
  }
);

module.exports = router;
