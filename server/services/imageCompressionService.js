import sharp from "sharp";
import path from "path";

const compressImage = async (inputPath, outputDirectory, compressionLevel) => {
    const outputFilename = `compressed-${Date.now()}.jpg`;
    const outputPath = path.join(outputDirectory, outputFilename);

    let quality = 75;

    if (compressionLevel === "low") {
        quality = 85;
    }

    if (compressionLevel === "medium") {
        quality = 70;
    }

    if (compressionLevel === "high") {
        quality = 50;
    }

    await sharp(inputPath)
        .jpeg({
            quality,
            mozjpeg: true,
        })
        .toFile(outputPath);

    return outputPath;
};

export default compressImage;