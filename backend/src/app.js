import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import errorMiddleware
from "./middlewares/error.middleware.js";

import adminRoutes
from "./routes/admin.routes.js";

import adminApprovalRoutes
from "./routes/adminApproval.routes.js";

import interviewRoutes
from "./routes/interview.routes.js";

import tokenRoutes
from "./routes/token.routes.js";

import ttsRoutes
from "./routes/tts.routes.js";

dotenv.config();

const app = express();

/* ================= PATH FIX ================= */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

/* ================= SECURITY ================= */

app.use(helmet());

app.use(compression());

app.use(cookieParser());

/* ================= LOGGER ================= */

app.use(morgan("dev"));

/* ================= RATE LIMIT ================= */

app.use(rateLimit({

  windowMs:
    15 * 60 * 1000,

  max: 100

}));

/* ================= CORS ================= */

/* ================= CORS ================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
     "https://ai-interview-frontend-sand.vercel.app",
    process.env.FRONTEND_URL  // https://ai-interview-frontend-sand.vercel.app
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ================= BODY PARSER ================= */

app.use(express.json());

/* ================= AUDIO STATIC ================= */

app.use(

  "/audio",

  express.static(

    path.join(
      __dirname,
      "../../tts-service/audio_cache"
    )

  )

);

/* ================= HEALTH ================= */

app.get("/health", (req, res) => {

  res.json({
    status: "OK"
  });

});

/* ================= ROUTES ================= */

app.use(
  "/api/tts",
  ttsRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/admin",
  adminApprovalRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/token",
  tokenRoutes
);

/* ================= ERROR MIDDLEWARE ================= */

app.use(errorMiddleware);

export default app;