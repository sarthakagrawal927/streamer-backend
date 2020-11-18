const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isSafe: {
    type: String,
    default: "OKAY",
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
  vitals: {},
});

module.exports = User = mongoose.model("User", UserSchema);
