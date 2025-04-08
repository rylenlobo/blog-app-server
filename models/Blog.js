const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: JSON, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
); // Adds createdAt & updatedAt

module.exports = mongoose.model("Blog", blogSchema);
