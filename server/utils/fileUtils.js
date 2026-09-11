import fs from "fs/promises";
import path from "path";

export const UPLOAD_DIR = path.resolve("uploads");
export const COMPRESSED_DIR = path.resolve("compressed");

export const ensureDirectories = async () => {
  await fs.mkdir(UPLOAD_DIR, {
    recursive: true,
  });

  await fs.mkdir(COMPRESSED_DIR, {
    recursive: true,
  });
};

export const deleteFileSafely = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        `Could not delete file: ${filePath}`,
        error.message,
      );
    }
  }
};

export const getSafeCompressedPath = (filename) => {
  const safeFilename = path.basename(filename);

  const filePath = path.resolve(
    COMPRESSED_DIR,
    safeFilename,
  );

  const compressedDirectoryWithSeparator =
    `${COMPRESSED_DIR}${path.sep}`;

  if (
    !filePath.startsWith(
      compressedDirectoryWithSeparator,
    )
  ) {
    throw new Error("Invalid file path.");
  }

  return filePath;
};