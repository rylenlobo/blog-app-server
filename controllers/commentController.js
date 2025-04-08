const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    // Verify the post exists
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const newComment = new Comment({
      postId,
      userId,
      content
    });

    const savedComment = await newComment.save();

    // Populate user information for the response
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "userId",
      "username"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a specific post
exports.getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    // Verify the post exists
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
