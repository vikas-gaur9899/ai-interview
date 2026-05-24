import express from "express";
import { generateTTS } from "../services/tts.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text required" });
    }

    const audioUrl = await generateTTS(text);

    res.json({ audioUrl });

  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ message: "TTS failed" });
  }
});

export default router;