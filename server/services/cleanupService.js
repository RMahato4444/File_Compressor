import fs from "fs/promises";
import path from "path";

import { UPLOAD_DIR, COMPRESSED_DIR } from "../utils/fileUtils.js";

const MAX_FILE_AGE = 30 * 60 * 1000;
// 30 minutes

const cleanupDirectory = async (directory) => {
  try {
    const files = await fs.readdir(directory, {
      withFileTypes: true,
    });

    const now = Date.now();

    for (const file of files) {
      if (!file.isFile()) {
        continue;
      }

      const filePath = path.join(directory, file.name);

      try {
        const stats = await fs.stat(filePath);

        const age = now - stats.mtimeMs;

        if (age > MAX_FILE_AGE) {
          await fs.unlink(filePath);

          console.log(`Cleanup: deleted ${file.name}`);
        }
      } catch (error) {
        console.error(`Cleanup failed for ${file.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Could not scan directory ${directory}:`, error.message);
  }
};

export const cleanupTemporaryFiles = async () => {
  await cleanupDirectory(UPLOAD_DIR);

  await cleanupDirectory(COMPRESSED_DIR);
};

export const startCleanupJob = () => {
  /*
   * Run once when the server starts.
   */
  cleanupTemporaryFiles();

  /*
   * Then run every 10 minutes.
   */
  setInterval(cleanupTemporaryFiles, 10 * 60 * 1000);
};
