const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts
} = require("../controllers/blogController");
const {
  createComment,
  getPostComments
} = require("../controllers/commentController");
// Blog post routes
router.post("/posts", verifyToken, createPost);
router.get("/posts", getAllPosts); // Public route - no auth required
router.get("/posts/:id", getPostById); // Public route - no auth required
router.get("/myposts", verifyToken, getMyPosts);
router.put("/edit-post/:id", verifyToken, updatePost);
router.delete("/posts/:id", verifyToken, deletePost);

// Comment routes
router.post("/posts/:id/comments", verifyToken, createComment);
router.get("/posts/:id/comments", getPostComments); // Public route - no auth required

module.exports = router;
