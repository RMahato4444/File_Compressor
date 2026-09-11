import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import compressionRateLimit from "../middleware/rateLimitMiddleware.js";

import validateUploadedFile from "../middleware/validateUploadedFile.js";

import compressFile from "../controllers/compressionController.js";

const router = express.Router();

router.post(
  "/compress",
  compressionRateLimit,
  upload.single("file"),
  validateUploadedFile,
  compressFile,
);

export default router;