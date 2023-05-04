const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Product = require("./dataSchema.js");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/images", express.static("images"));
mongoose.connect("mongodb://127.0.0.1:27017/reactdata", {
dbName: "reactdata",
useNewUrlParser: true,
useUnifiedTopology: true,
});
app.get("/", async (req, resp) => {
    const query = {};
    const allProducts = await Products.find(query);
    console.log("allProducts");
    resp.send(allProducts);
    });
const port = process.env.PORT || 4000;
const host = "localhost";
app.listen(port, () => {
console.log(`App listening at http://%s:%s`, host, port);
});