const express = require("express");
const router = express.Router();
const Post = require("../controllers/post");
router.get("/", Post.getPosts);
router.post("/", Post.addPosts);
module.exports = router;