const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  city: { type: String },
});

// pre save for password incrypt

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.verifypassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

var User = mongoose.model("User", userSchema);

module.exports = User;
