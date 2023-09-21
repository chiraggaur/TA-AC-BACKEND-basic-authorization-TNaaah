const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");

const articleSchema = new Schema({
  title: { type: String },
  description: { type: String },
  likes: { type: Number },
  comments: Schema.Types.ObjectId,
  author: { type: String },
  slug: { type: String, unique: true }, // unique doubt
});

// pre save for slug

articleSchema.pre("save", async function (next) {
  try {
    this.slug = await slug(this.title, "-");
    next();
  } catch (err) {
    next(err);
  }
});

var Article = mongoose.model("Articles", articleSchema);

module.exports = Article;
