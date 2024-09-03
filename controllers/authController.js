const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const { has } = require("config");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;
    if (!email && !password && !fullname) {
      return res
        .status(400)
        .send({ message: "enail password & fullname required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    if (!fullname) {
      return res.status(400).send({ message: "Fullname is required" });
    }
    let user = await userModel.findOne({ email });
    if (user) {
      let error = req.flash("error","you have already accounnt")
      return res.redirect("/")
    }
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          let token = generateToken(user);
          res.cookie("token", token);
          let success = req.flash("success", "Account Created Successfullu")
          res.redirect("/shop");
        }
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).send({ message: "Email & Password are required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    let user = await userModel.findOne({ email });
    if (!user) return res.send("Email Or Password Incorrect");
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
      } else {
        return res.send("Email Or Password Incorrect");
      }
    });
  } catch (err) {
    console.error(err.message);
  }
};
