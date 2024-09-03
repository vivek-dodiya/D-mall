const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim : true,
    minLength : 3
  },
  email: String,
  password: String,
  cart: [{
    type : mongoose.Schema.Types.ObjectId,
    default : [],
    ref : 'product'
  }],
  orders: {
    type : [],
    default : []
  },
  contact: Number,
  pictre: String,
});

module.exports = mongoose.model('user' , userSchema);
