import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { performance } from "perf_hooks";

const API_URL =
    "http://localhost:5000/api/compress";

const TEST_FOLDER = "./benchmark/test-files";

const files = fs
  .readdirSync(TEST_FOLDER)
  .filter((file) => /\.(jpg|jpeg|png|webp|pdf|docx|pptx)$/i.test(file));

const results = [];

console.log(`Testing ${files.length} files...\n`);

for (const filename of files) {

  const filePath = path.join(TEST_FOLDER, filename);
  const originalSize = fs.statSync(filePath).size;

  const form = new FormData();

  form.append("file", fs.createReadStream(filePath));

  form.append("compressionLevel", "medium");

  const start = performance.now();

  try {
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        "X-Benchmark": "true",
      },
      responseType: "json",
      timeout: 120000,
    });

    const end = performance.now();

    const processingTime = (end - start) / 1000;

    const compressedSize = response.data.compressedFile.size;

    const savings = ((originalSize - compressedSize) / originalSize) * 100;

    results.push({
      filename,
      originalSize,
      compressedSize,
      savings,
      processingTime,
      success: true,
    });

    console.log(
      `${filename.padEnd(30)} ` +
        `${savings.toFixed(2)}% saved | ` +
        `${processingTime.toFixed(2)}s`,
    );
  } catch (error) {
    console.log(
      `FAILED: ${filename} → ${error.response?.data?.message || error.message}`,
    );

    results.push({
      filename,
      success: false,
    });
  }
}

const successful = results.filter((r) => r.success);

if (successful.length === 0) {
  console.log("\nNo successful tests.");
  process.exit(1);
}

const averageSavings =
  successful.reduce((sum, r) => sum + r.savings, 0) / successful.length;

const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);

const totalCompressed = successful.reduce(
  (sum, r) => sum + r.compressedSize,
  0,
);

const weightedSavings =
  ((totalOriginal - totalCompressed) / totalOriginal) * 100;

const averageTime =
  successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length;

const minTime = Math.min(...successful.map((r) => r.processingTime));

const maxTime = Math.max(...successful.map((r) => r.processingTime));

console.log("\n================================");
console.log("FILE COMPRESSOR BENCHMARK");
console.log("================================");

console.log(`Files tested       : ${files.length}`);

console.log(`Successful         : ${successful.length}`);

console.log(`Failed             : ${files.length - successful.length}`);

console.log(`Average reduction  : ${averageSavings.toFixed(2)}%`);

console.log(`Weighted reduction : ${weightedSavings.toFixed(2)}%`);

console.log(`Average time       : ${averageTime.toFixed(2)}s`);

console.log(`Fastest            : ${minTime.toFixed(2)}s`);

console.log(`Slowest            : ${maxTime.toFixed(2)}s`);
