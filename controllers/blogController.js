const Blog = require("../models/Blog");

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const authorId = req.user.id;
    const newPost = new Blog({
      title,
      summary,
      content,
      authorId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find({}, "_id title summary authorId createdAt")
      .populate("authorId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate(
      "authorId",
      "firstName lastName"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog post
exports.updatePost = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this post" });
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, summary, content },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author of the post
    if (post.authorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts by the currently authenticated user
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id; // <-- FIXED HERE

    const posts = await Blog.find(
      { authorId: userId },
      "_id title summary authorId createdAt"
    )
      .populate("authorId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
