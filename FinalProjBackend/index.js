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

app.post("/insert", async (req, res) => {
  console.log(req.body);
  const p_id = req.body._id;
  const ptitle = req.body.title;
  const pprice = req.body.price;
  const pdescription = req.body.description;
  const pcategory = req.body.category;
  const prate = req.body.rating.rate;
  const pimage = req.body.image;
  const pcount = req.body.rating.count;

  const formData = new Product({
    _id: p_id,
    title: ptitle,
    price: pprice,
    description: pdescription,
    category: pcategory,
    rating: { rate: prate, count: pcount },
    image: pimage,
  });
  try {
    await Product.create(formData);
    const messageResponse = { message: `Product ${p_id} added` };
    res.send(JSON.stringify(messageResponse));
  } catch (err) {
    console.log("Error while adding a new product:" + err);
  }
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

app.post("/cart", async (req, res) =>{
  const newCartItem = req.body;


});

// const CartItem = require('../models/cartItem');
// app.post('/cart', async (req, res) =>{
//   const { id, title, price, description, category, rating, image} = req.body;

//   const newCartItem = new CartItem({
//     id: id,
//     title: title,
//     price: price,
//     description: description,
//     category: category,
//     rating: rating,
//     image: image
//   });

//   newCartItem.save()
//     .then(result =>{
//       res.status(201).json({message: 'Cart item added successfully', cartItem: result});
//     })
//     .catch(err => {
//       res.status(500).json({ error: err});
//     });
// });