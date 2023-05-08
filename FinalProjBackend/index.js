const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Product } = require("./dataSchema"); // import the Product model
const app = express();
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cors());
app.use(express.static("images"));


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
  quantity: {type:Number}
});

// Create a model for the 'cartItems' collection
const CartItem = mongoose.model('carts', cartitemSchema);

app.post('/Cart', async (req, res) => {
  const { _id, title, description, price, image, rating, quantity } = req.body;
  const cartItem = await CartItem.create({
    _id,
    title,
    description,
    price,
    image,
    rating,
    quantity
  });
  res.send(cartItem);
});

app.put('/Cart/:id', async (req, res) => {
  const id = req.params._id;
  const { quantity } = req.body;
  try {
    const cartItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true } // Return the updated document
    );
    if (!cartItem) {
      return res.status(404).send('Cart item not found');
    }
    res.send(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

mongoose.connect("mongodb://127.0.0.1:27017/StoreProject", {
  dbName: "StoreProject",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 4000;
const host = "localhost";

app.get("/", async (req, resp) => {
  const query = {};
  const products = await Product.find(query);
  console.log(products);
  resp.set("Access-Control-Allow-Origin", "*");
  resp.send(products);
});

app.get("/:id", async (req, resp) => {
  const id = req.params.id;
  const query = { _id: id };
  const oneProduct = await Product.findOne(query);
  console.log(oneProduct);
  resp.send(oneProduct);
});

app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});

app.delete("/delete", async (req, res) => {
  console.log("Delete :", req.body);
  try {
    const query = { _id: req.body._id };
    await Product.deleteOne(query);
    "Z:\Desktop\ClassActivities319\gitrepo\FinalProject\FinalProjFrontend\src\App.js"
    const messageResponse = {
      message: `Product ${req.body._id} deleted`,
    };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error deleting :" + p_id + " " + err);
  }
});
app.put("/edite/:id", async (req, res) =>{
    const id = req.params.id;
    const query = { _id: id };
    const update = req.body; 
    try {
      const updatedProduct = await Product.findOneAndUpdate(query, update, {
        new: true, 
      });
      console.log(updatedProduct);
      res.send(updatedProduct);
    } catch (err) {
      console.log("Error while updating the product:" + err);
      res.status(500).send("Error while updating the product");
    }
  });
  app.use('/images', (req, res, next) => {
    try {
      express.static(path.join(__dirname, 'images'))(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });


  app.get('/cartItems', async(req,res) =>{
    const id = req.params.id;
    const query = { _id: id };
    const oneProduct = await CartItem.findOne(query);
    console.log(oneProduct);
    resp.send(oneProduct);
  });
