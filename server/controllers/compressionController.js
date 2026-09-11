import fs from "fs/promises";
import path from "path";

import compressImage from "../services/imageCompressionService.js";
import compressPDF from "../services/pdfCompressionService.js";
import compressOfficeFile from "../services/officeCompressionService.js";

import { deleteFileSafely, COMPRESSED_DIR } from "../utils/fileUtils.js";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const officeExtensions = [".docx", ".pptx"];

const compressFile = async (req, res) => {
  let compressedPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const compressionLevel = req.body.compressionLevel || "medium";

    const originalPath = req.file.path;

    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === ".pdf") {
      compressedPath = await compressPDF(
        originalPath,
        COMPRESSED_DIR,
        compressionLevel,
      );
    } else if (officeExtensions.includes(fileExtension)) {
      const officeResult = await compressOfficeFile(
        originalPath,
        COMPRESSED_DIR,
        compressionLevel,
      );

      compressedPath = officeResult.outputPath;

      console.log(`Optimized embedded images: ${officeResult.optimizedImages}`);
    } else if (imageExtensions.includes(fileExtension)) {
      compressedPath = await compressImage(
        originalPath,
        COMPRESSED_DIR,
        compressionLevel,
      );
    } else {
      await deleteFileSafely(originalPath);

      return res.status(400).json({
        success: false,
        message: "Unsupported file format.",
      });
    }

    const originalStats = await fs.stat(originalPath);

    const compressedStats = await fs.stat(compressedPath);

    const originalSize = originalStats.size;
    const compressedSize = compressedStats.size;

    let savings = ((originalSize - compressedSize) / originalSize) * 100;

    if (savings < 0) {
      savings = 0;
    }

    /*
     * The original upload is no longer needed
     * after successful compression.
     */
    await deleteFileSafely(originalPath);

    res.json({
      success: true,

      originalFile: {
        name: req.file.originalname,
        size: originalSize,
      },

      compressedFile: {
        name: path.basename(compressedPath),
        size: compressedSize,
        url: `/download/${path.basename(compressedPath)}`,
      },

      savings: Number(savings.toFixed(2)),
    });
  } catch (error) {
    console.error("====================================");

    console.error("COMPRESSION ERROR");

    console.error("Message:", error.message);

    console.error("Stack:", error.stack);

    console.error("====================================");

    if (req.file?.path) {
      await deleteFileSafely(req.file.path);
    }

    if (compressedPath) {
      await deleteFileSafely(compressedPath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Compression failed.",
    });
  }
};

export default compressFile;
