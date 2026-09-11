import fs from "fs/promises";
import path from "path";
import { fileTypeFromFile } from "file-type";

import { deleteFileSafely } from "../utils/fileUtils.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const validateUploadedFile = async (
  req,
  res,
  next,
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a file.",
    });
  }

  try {
    const detectedType =
      await fileTypeFromFile(
        req.file.path,
      );

    /*
     * Some older Office formats such as DOC/PPT
     * may not always be detected consistently by
     * file-type because of their older binary format.
     *
     * We therefore use extension + detected type
     * with special handling for those formats.
     */
    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const legacyOfficeExtensions = [
      ".doc",
      ".ppt",
    ];

    if (
      legacyOfficeExtensions.includes(
        extension,
      )
    ) {
      return next();
    }

    if (
      !detectedType ||
      !allowedMimeTypes.has(
        detectedType.mime,
      )
    ) {
      await deleteFileSafely(
        req.file.path,
      );

      return res.status(400).json({
        success: false,
        message:
          "The uploaded file content does not match a supported file type.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "File validation error:",
      error.message,
    );

    await deleteFileSafely(
      req.file?.path,
    );

    return res.status(400).json({
      success: false,
      message:
        "Unable to validate the uploaded file.",
    });
  }
};

export default validateUploadedFile;