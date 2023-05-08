const mongoose = require("mongoose");
const cartitemSchema = new mongoose.Schema({
  _id: {type:Number},
  title: {type:String},
  description: {type:String},
  price: {type:Number},
  image: {type:String},
  rating: {
    rate: {type:Number},
    count: {type:Number}
  },
  quantity: {type:Number},
  __v: {type:Number}
},
{ collection: "carts",versionKey: false  }
);

// Create a model for the 'cartItems' collection
const CartItem = mongoose.model('carts', cartitemSchema);

module.exports = {
  CartItem,
};