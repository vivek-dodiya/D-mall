const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model")

if(process.env.NODE_ENV === "development"){
    router.post("/create", async (req,res)=>{
        let owners = await ownerModel.find();
        let {fullname,email,password} = req.body
        if(owners.length > 0){
            res.status(503).send("You do not have permission to create Owner because Owner already created")
        }else{
            let createdOwner= await ownerModel.create({
                fullname,
                email,
                password
            })
            res.status(201).send(createdOwner)
        }
    });
};

router.get("/" , (req,res)=>{
    let success= req.flash("success");
    res.render("createproducts" , {success})
})

module.exports = router