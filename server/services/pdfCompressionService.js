import dotenv from "dotenv";
import { spawn } from "child_process";
import path from "path";

import { runProcessWithTimeout } from "../utils/processUtils.js";

dotenv.config();

const GHOSTSCRIPT_PATH =
  process.env.GHOSTSCRIPT_PATH ||
  (process.platform === "win32"
    ? "gswin64c"
    : "gs");

const compressPDF = (inputPath, outputDirectory, compressionLevel) => {
  return new Promise(async (resolve, reject) => {
    try {
      const outputFilename = `compressed-${Date.now()}.pdf`;

      const outputPath = path.resolve(outputDirectory, outputFilename);

      let pdfSettings = "/ebook";

      if (compressionLevel === "low") {
        pdfSettings = "/printer";
      }

      if (compressionLevel === "medium") {
        pdfSettings = "/ebook";
      }

      if (compressionLevel === "high") {
        pdfSettings = "/screen";
      }

      const ghostscript = spawn(
        GHOSTSCRIPT_PATH,
        [
          "-sDEVICE=pdfwrite",
          "-dCompatibilityLevel=1.4",
          `-dPDFSETTINGS=${pdfSettings}`,
          "-dNOPAUSE",
          "-dQUIET",
          "-dBATCH",
          `-sOutputFile=${outputPath}`,
          inputPath,
        ],
        {
          windowsHide: true,
        },
      );

      const result = await runProcessWithTimeout(ghostscript, 60 * 1000);

      if (result.code !== 0) {
        reject(
          new Error(
            result.stderr ||
              result.stdout ||
              `Ghostscript exited with code ${result.code}`,
          ),
        );

        return;
      }

      resolve(outputPath);
    } catch (error) {
      reject(error);
    }
  });
};

export default compressPDF;
