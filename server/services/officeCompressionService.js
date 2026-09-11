import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import sharp from "sharp";

const getCompressionSettings = (compressionLevel) => {
  if (compressionLevel === "low") {
    return {
      jpegQuality: 85,
      webpQuality: 85,
    };
  }

  if (compressionLevel === "high") {
    return {
      jpegQuality: 50,
      webpQuality: 50,
    };
  }

  return {
    jpegQuality: 70,
    webpQuality: 70,
  };
};

const compressOfficePackage = async (
  inputPath,
  outputPath,
  compressionLevel,
  mediaDirectory,
) => {
  const zip = new AdmZip(inputPath);

  const settings =
    getCompressionSettings(compressionLevel);

  const entries = zip.getEntries();

  let optimizedImages = 0;

  for (const entry of entries) {
    if (entry.isDirectory) {
      continue;
    }

    const entryPath = entry.entryName.replaceAll(
      "\\",
      "/",
    );

    if (!entryPath.startsWith(mediaDirectory)) {
      continue;
    }

    const extension = path
      .extname(entryPath)
      .toLowerCase();

    const imageBuffer = entry.getData();

    try {
      let compressedBuffer = null;

      if (
        extension === ".jpg" ||
        extension === ".jpeg"
      ) {
        compressedBuffer = await sharp(
          imageBuffer,
        )
          .jpeg({
            quality: settings.jpegQuality,
            mozjpeg: true,
          })
          .toBuffer();
      } else if (extension === ".png") {
        compressedBuffer = await sharp(
          imageBuffer,
        )
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toBuffer();
      } else if (extension === ".webp") {
        compressedBuffer = await sharp(
          imageBuffer,
        )
          .webp({
            quality: settings.webpQuality,
          })
          .toBuffer();
      }

      if (
        compressedBuffer &&
        compressedBuffer.length <
          imageBuffer.length
      ) {
        entry.setData(compressedBuffer);
        optimizedImages++;
      }
    } catch (error) {
      console.warn(
        `Could not optimize ${entryPath}: ${error.message}`,
      );
    }
  }

  zip.writeZip(outputPath);

  return optimizedImages;
};

const compressOfficeFile = async (
  inputPath,
  outputDirectory,
  compressionLevel,
) => {
  const extension = path
    .extname(inputPath)
    .toLowerCase();

  let mediaDirectory;

  if (extension === ".docx") {
    mediaDirectory = "word/media/";
  } else if (extension === ".pptx") {
    mediaDirectory = "ppt/media/";
  } else {
    throw new Error(
      "DOC and PPT are not supported on this deployment. Please use DOCX or PPTX.",
    );
  }

  const outputPath = path.join(
    outputDirectory,
    `compressed-${Date.now()}${extension}`,
  );

  const optimizedImages =
    await compressOfficePackage(
      inputPath,
      outputPath,
      compressionLevel,
      mediaDirectory,
    );

  return {
    outputPath,
    optimizedImages,
    extension,
  };
};

export default compressOfficeFile;