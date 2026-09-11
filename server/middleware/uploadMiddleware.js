import multer from "multer";
import path from "path";
import fs from "fs";

import { UPLOAD_DIR } from "../utils/fileUtils.js";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".docx",
  ".pptx",
];

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const extensionAllowed =
    allowedExtensions.includes(extension);

  const mimeAllowed =
    allowedMimeTypes.includes(file.mimetype);

  if (extensionAllowed && (mimeAllowed || extensionAllowed)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Supported files are JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX, PPT and PPTX.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

export default upload;