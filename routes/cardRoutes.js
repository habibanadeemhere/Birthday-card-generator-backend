import express from "express";
import mongoose from "mongoose";
import Card from "../models/Card.js";

const router = express.Router();

// POST /api/cards  -> create + save a new birthday card
router.post("/", async (req, res) => {
  try {
    const { recipientName, senderName, message, theme, font, photo } = req.body;

    if (!recipientName || !senderName || !message) {
      return res.status(400).json({
        error: "recipientName, senderName and message are required.",
      });
    }

    const card = await Card.create({
      recipientName,
      senderName,
      message,
      theme,
      font,
      photo: photo || null,
    });

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Could not save the card.", details: err.message });
  }
});

// GET /api/cards -> latest cards for the public gallery (photo omitted to keep payload light)
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 24, 50);
    const cards = await Card.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-photo");

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Could not load the gallery.", details: err.message });
  }
});

// GET /api/cards/:id -> a single card (used by the shareable link page)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "That card link looks invalid." });
    }

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "This card doesn't exist or was removed." });
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Could not load this card.", details: err.message });
  }
});

// DELETE /api/cards/:id -> remove a card
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "That card link looks invalid." });
    }

    const deleted = await Card.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "This card doesn't exist or was already removed." });
    }

    res.json({ message: "Card deleted." });
  } catch (err) {
    res.status(500).json({ error: "Could not delete this card.", details: err.message });
  }
});

export default router;
