const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    content: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: "article", required: true },
  },
  { timestamps: true }
);

var Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
