import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";

import compressionRoutes from "./routes/compressionRoutes.js";

import { ensureDirectories, getSafeCompressedPath } from "./utils/fileUtils.js";

import { startCleanupJob } from "./services/cleanupService.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

await ensureDirectories();
startCleanupJob();

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());

app.use("/api", compressionRoutes);

app.get("/download/:filename", async (req, res) => {
  try {
    const filePath = getSafeCompressedPath(req.params.filename);

    await fs.access(filePath);

    res.download(filePath, path.basename(filePath), async (error) => {
      if (error) {
        console.error("Download error:", error.message);

        if (!res.headersSent) {
          res.status(404).json({
            success: false,
            message: "File not found.",
          });
        }

        return;
      }

      try {
        await fs.unlink(filePath);

        console.log(`Deleted downloaded file: ${path.basename(filePath)}`);
      } catch (deleteError) {
        console.error("Could not delete downloaded file:", deleteError.message);
      }
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    console.error("Download error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to download file.",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "File Compressor API is running",
  });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
