const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLogedin = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!req.cookies.token){
        req.flash("error","you need logedin first");
        return res.redirect("/")
    }
    try{
        let decoded = jwt.verify(req.cookies.token , process.env.JWT_KEY);
        let user = await userModel.findOne({email: decoded.email}).select("-password");
        req.user = user;
        next();
    }catch(err){
        req.flash("error","somthing wents wrong");
        return res.redirect("/");
    }
};