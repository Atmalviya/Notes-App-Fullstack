const express = require("express");
const router = express.Router();
const Note = require("../models/note.model");
const { authenticateToken } = require("../utils");
const app = express();
app.use(express.json());

// Get Notes
router.get("/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      message: "Notes retrieved successfully",
      notes: notes,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error retrieving notes", error: true, err });
  }
});

// Create Note
router.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "title and content fields are required", error: true });
  }
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();
    return res.json({
      error: false,
      message: "Note created successfully",
      note: note,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating note", error: true, err });
  }
});

// Edit Note
router.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "title and content fields are required", error: true });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found", error: true });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags || [];
    if (isPinned) note.isPinned = isPinned || false;
    await note.save();
    return res.json({
      error: false,
      message: "Note updated successfully",
      note: note,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating note", error: true, err });
  }
});

// Delete Note
router.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found", error: true });
    }
    await note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ message: "Note deleted successfully", error: false });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting note", error: true, err });
  }
});

// Update isPinned status
router.put("/pin-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found", error: true });
    }
    note.isPinned = !note.isPinned;
    await note.save();
    return res.json({
      message: "Note pinned status updated successfully",
      error: false,
      isPinned: note.isPinned,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating pinned status", error: true, err });
  }
});

// Search Notes
router.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ message: "Query parameter is required", error: true });
  }
  try {
    const notes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      message: "Notes retrieved successfully",
      notes: notes,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error retrieving notes", error: true, err });
  }
});

module.exports = router;
