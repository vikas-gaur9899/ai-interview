import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";

import { fileURLToPath } from "url";

import cloudinary from "../config/cloudinary.js";

/* ================= PATH SETUP ================= */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const AUDIO_DIR = path.join(
  __dirname,
  "../../../tts-service/audio_cache"
);

/* ================= ENV ================= */

const SARVAM_API_KEY =
  process.env.SARVAM_API_KEY;

/* ================= CREATE AUDIO DIR ================= */

if (!fs.existsSync(AUDIO_DIR)) {

  fs.mkdirSync(AUDIO_DIR, {
    recursive: true
  });

}

/* ================= CLEAN TEXT ================= */

const cleanText = (text) => {

  return text
    .replace(/_/g, "")
    .replace(/\*+/g, "")
    .replace(/`+/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/skipped/gi, "")
    .replace(/\s+/g, " ")
    .replace(/["]/g, "")
    .trim();

};

/* ================= CLOUDINARY ================= */

const uploadToCloudinary =
  async (filePath, publicId) => {

    const result =
      await cloudinary.uploader.upload(

        filePath,

        {

          resource_type: "auto",

          folder:
            "ai-interview-audio",

          public_id:
            publicId

        }

      );

    return result.secure_url;

  };

/* ================= SARVAM TTS ================= */

const generateSarvamTTS =
  async (text, filePath) => {

    try {

      const response =
        await axios.post(

          "https://api.sarvam.ai/text-to-speech",

          {

            text,

            target_language_code:
              "en-IN",

            speaker:
              "sumit",

            model:
              "bulbul:v3",

            pace: 1.0,

            speech_sample_rate: 22050,

            output_audio_codec: "mp3",

            enable_preprocessing: true

          },

          {

            headers: {

              "api-subscription-key":
                SARVAM_API_KEY,

              "Content-Type":
                "application/json"

            },

            timeout: 30000

          }

        );

      /* ================= GET BASE64 AUDIO ================= */

      const base64Audio =
        response.data?.audios?.[0];

      if (!base64Audio) {

        console.log(
          "❌ NO AUDIO RECEIVED"
        );

        return false;

      }

      /* ================= CONVERT TO BUFFER ================= */

      const audioBuffer =
        Buffer.from(
          base64Audio,
          "base64"
        );

      /* ================= SAVE MP3 ================= */

      fs.writeFileSync(
        filePath,
        audioBuffer
      );

      return true;

    } catch (err) {

      console.log(

        "❌ SARVAM ERROR:",

        err.response?.data ||

        err.message

      );

      return false;

    }

  };

/* ================= GENERATE TTS ================= */

export const generateTTS =
  async (text) => {

    try {

      if (
        !text ||
        typeof text !== "string"
      ) {

        console.log(
          "❌ Invalid TTS text"
        );

        return null;

      }

      const cleanedText =
        cleanText(text);

      console.log(
        "🧹 CLEANED TEXT:",
        cleanedText
      );

      /* ================= HASH ================= */

      const hash = crypto

        .createHash("md5")

        .update(cleanedText)

        .digest("hex");

      const fileName =
        `tts_${hash}.mp3`;

      const filePath = path.join(
        AUDIO_DIR,
        fileName
      );

      const publicId =
        fileName.replace(
          ".mp3",
          ""
        );

      /* ================= CACHE ================= */

      if (
        fs.existsSync(filePath)
      ) {

        const stat =
          fs.statSync(filePath);

        if (stat.size > 0) {

          console.log(
            "✅ CACHE HIT"
          );

          return `/audio/${fileName}`;

        }

        fs.unlinkSync(filePath);

      }

      /* ================= ENV CHECK ================= */

      if (!SARVAM_API_KEY) {

        console.log(
          "❌ SARVAM API KEY MISSING"
        );

        return null;

      }

      /* ================= GENERATE ================= */

      console.log(
        "🗣 GENERATING SARVAM TTS..."
      );

      let success =
        await generateSarvamTTS(
          cleanedText,
          filePath
        );

      /* ================= RETRY ================= */

      if (!success) {

        console.log(
          "🔄 RETRYING SARVAM..."
        );

        await new Promise(
          (r) =>
            setTimeout(r, 2000)
        );

        success =
          await generateSarvamTTS(
            cleanedText,
            filePath
          );

      }

      if (!success) {

        console.log(
          "❌ SARVAM FAILED"
        );

        return null;

      }

      /* ================= VERIFY ================= */

      if (

        !fs.existsSync(filePath) ||

        fs.statSync(filePath).size === 0

      ) {

        console.log(
          "❌ AUDIO FILE EMPTY"
        );

        return null;

      }

      console.log(
        "✅ AUDIO GENERATED"
      );

      /* ================= CLOUDINARY ================= */

      try {

        const cloudUrl =
          await uploadToCloudinary(
            filePath,
            publicId
          );

        console.log(
          "☁️ CLOUDINARY UPLOADED"
        );

        if (
          fs.existsSync(filePath)
        ) {

          fs.unlinkSync(filePath);

        }

        return cloudUrl;

      } catch (cloudErr) {

        console.log(

          "⚠️ CLOUDINARY FAILED:",

          cloudErr.message

        );

        return `/audio/${fileName}`;

      }

    } catch (err) {

      console.log(
        "❌ GENERATE TTS CRASH:",
        err
      );

      return null;

    }

  };