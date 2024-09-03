const express = require("express");
const { models } = require("mongoose");
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")
const { isLogedin } = require("../middlewares/isLogedin");
const { use } = require("bcrypt/promises");
const { log } = require("debug/src/browser");
const {generateToken} = require("../utils/generateToken")
const router = express.Router();

router.get("/",(req,res)=>{
    let error = req.flash("error")
    res.render("index",{error, loggedin : false});
});

router.get("/shop", isLogedin ,async (req,res)=>{
    let products = await productModel.find();
    let success = req.flash("success")
    res.render("shop",{products , success});
});

router.get("/cart", isLogedin ,async (req,res)=>{
    let user = await userModel.findOne({email : req.user.email}).populate("cart");
    let totalBill = user.cart.reduce(( total, item) => {
        let price = Number(item.price);
        let discount = Number(item.discount);
        return total + price - discount;
    },0);
    const additionalCharge = 20;
    const bill = totalBill + additionalCharge;
    res.render("cart",{user,bill });
});

router.get("/addtocart/:productid", isLogedin , async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Product Added to Cart");
    res.redirect("/shop");
});

router.get("/logout", isLogedin,  async (req,res)=>{    
    res.clearCookie("token");
    res.redirect("/");
});

router.get("/cart", isLogedin,  async (req,res)=>{    
    res.render("cart");
});

router.post("/product/delete/:_id",isLogedin,  async(req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    let productIndex = user.cart.findIndex(item => item._id.toString() === req.params._id);
    user.cart.splice(productIndex, 1);
    await user.save();
    res.redirect("/cart");
});

router.get("/deleteprofile/:_id",isLogedin,  async(req,res)=>{
    let user = await userModel.findOneAndDelete({email: req.user.email});
    res.redirect("/");
});

router.get("/editprofile/:_id",isLogedin,  async(req,res)=>{
    let user = await userModel.findOne({_id: req.user._id});
    res.render("editprofile" , {user})
});

router.post("/editprofile",isLogedin,  async(req,res)=>{
    try{
       let user = await userModel.findOneAndUpdate({_id: req.user._id} , {fullname : req.body.fullname, email : req.body.email}, {new : true});
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/profile")   
    }catch{
        console.error(err);
        res.status(500).send("Error updating profile");
    }
    
});

router.get("/profile", isLogedin , async (req,res)=>{
    let user = await userModel.findOne({_id : req.user._id});
    res.render("profile",{user});
});

module.exports = router