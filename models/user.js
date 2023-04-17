const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String },
  password: { type: String },
  token: { type: String },
  address: { type: String },
  contactNo :{type : String}
});

module.exports = mongoose.model("user", userSchema);