import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Assuming you have a User model
    // },
    // category: {
    //   type: String,
    // },
    // tags: [
    //   {
    //     type: String,
    //   },
    // ],
    // views: {
    //   type: Number,
    //   default: 0,
    // },
    // likes: {
    //   type: Number,
    //   default: 0,
    // },
    // comments: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     text: String,
    //     createdAt: { type: Date, default: Date.now },
    //   },
    // ],
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    seoKeywords: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
