const mongoose = require("mongoose");
const ReactFormDataSchema = new mongoose.Schema(
  {
    name: {type: String},
    email: {type: String},
    cardNum: {type:Number},
    address1:{type:String},
    city:{type:String},
    state:{type:String},
    zipCode:{type:Number}
  },
  { collection: "StoreProject.customerinfo" }
);
const CustomerInfo = mongoose.model('Customerinfo', ReactFormDataSchema);
module.exports = {
  CustomerInfo,
};