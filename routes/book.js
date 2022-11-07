const express = require("express");
const dotenv = require("dotenv");
const Post = require("../models/book");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();
dotenv.config();
// endpoint to make a pdf post
router.post("/post", upload.array("post_files", 10), async (req, res) => {
  const { token, title, body, owner_name, author, description, summary, number_of_pages, date_released } = req.body;

  if (!token || !title || !owner_name) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    const timestamp = Date.now();

    console.log(process.env.JWT_SECRET);
    let user = jwt.verify(token, process.env.JWT_SECRET);
    let post = new Post();

    let book_urls = [];
    let book_ids = [];

    if (req.files) {
      if (req.files.length != 0) {
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path, {
            folder: "bookdirectory",
          });
          console.log(result);
          book_urls.push(result.secure_url);
          book_ids.push(result.public_id);
        }
      }
    }

    post.title = title;
    post.body = body;
    post.author = author;
    post.description = description || "";
    post.timestamp = timestamp;
    post.number_of_pages = number_of_pages;
    post.summary = summary;
    post.date_released = date_released;
    post.book = book_urls;
    post.book_ids = book_ids;
    //post.owner_id =  owner_id;

    post = await post.save();

    // increment post count
    user = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $inc: { "stats.post_count": 1 },
      },
      { new: true }
    );

    console.log(user);

    return res.status(200).send({ status: "ok", msg: "Success", post });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: "error", msg: "An error occured" });
  }
});


// endpoint to edit a book post
router.post("/edit_post", async (req, res) => {
  const { post_id, token, title, body, author, description, summary, number_of_pages, date_released } = req.body;

  // check for required fields
  if (!post_id || !token) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    // token verification
    jwt.verify(token, process.env.JWT_SECRET);

    const timestamp = new Date();
    // check if document exists
    let post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).send({ status: "error", msg: "post not found" });
    }

    // update post document
    post = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        title: title || post.title,
        author: author || post.author,
        description: description || post.description,
        summary: summary || summary,
        number_of_pages: number_of_pages || number_of_pages,
        date_released: date_released || date_released,
        body: body || post.body,
        edited_at: timestamp,
        edited: true,
      },
      { new: true }
    ).lean();
    return res
      .status(200)
      .send({ status: "ok", msg: "Post edited successfully", post });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occurred" });
  }
});

// endpoint to fetch all books posted by  a specific user
router.post("/all_specific_userpost", async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });

  try {
    // token verification
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.find({ user_id: user.id })
      .select(["body", "title", "likes", "author", "owner_id", "owner_name"])
      .lean();
    // console.log(post);

    return res
      .status(200)
      .send({ status: "ok", msg: "Posts gotten successfully", post });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ status: "error", msg: "Some error occurred" });
  }
});

module.exports = router;