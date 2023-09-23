const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");

const articleSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    likes: { type: Number },
    comments: { type: Schema.Types.ObjectId },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    slug: { type: String, unique: true }, // unique doubt
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

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
