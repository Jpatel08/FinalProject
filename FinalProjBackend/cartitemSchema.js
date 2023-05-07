const mongoose = require("mongoose");
const ReactFormDataSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    rating:{type: Number},
    quantity: {type: Number},
  },
  { collection: "Cart" }
);

const CartItems = mongoose.model('Product', ReactFormDataSchema);

module.exports = {
<<<<<<< HEAD:FinalProjBackend/cartSchema.js
<<<<<<< HEAD
  Product,
=======
  cartItem,
>>>>>>> 7ee8e9f848bc77442ac93c043e60cd3fc1496ba8
=======
  CartItems,
>>>>>>> main:FinalProjBackend/cartitemSchema.js
};