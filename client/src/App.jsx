import { useState } from "react";
import { FileArchive, Sparkles } from "lucide-react";

import FileUpload from "./components/FileUpload";
import CompressionOptions from "./components/CompressionOptions";
import CompressionResult from "./components/CompressionResult";
import { compressFile } from "./services/compressionService";

function App() {
  const [file, setFile] = useState(null);

  const [compressionLevel, setCompressionLevel] = useState("medium");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await compressFile(file, compressionLevel);

      if (!data.success) {
        throw new Error(data.message || "Compression failed.");
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while compressing the file.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#F5C3D8] bg-white px-4 py-2 text-xs font-bold tracking-[0.15em] text-[#B83E72] shadow-sm">
            <Sparkles size={14} className="text-[#D94F8A]" />
            SMART FILE COMPRESSION
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#54213A] sm:text-6xl">
            Compress your files.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#85566C] sm:text-lg">
            Reduce file size quickly while keeping your files easy to use, share
            and download.
          </p>
        </header>

        {/* Main card */}
        <main className="overflow-hidden rounded-[32px] border border-[#F5D2C0] bg-white shadow-[0_25px_70px_rgba(217,79,138,0.12)]">
          {/* Top gradient */}
          <div className="h-2 bg-gradient-to-r from-[#D94F8A] via-[#EC739F] to-[#FFB38A]" />

          <div className="p-5 sm:p-8 lg:p-10">
            {/* Section heading */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D94F8A] to-[#FFB38A] text-white shadow-lg shadow-[#D94F8A]/20">
                <FileArchive size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#54213A]">
                  Universal file compressor
                </h2>

                <p className="text-sm text-[#9B6C7F]">
                  Images, PDFs, Word documents and PowerPoint files
                </p>
              </div>
            </div>

            <FileUpload file={file} onFileSelect={handleFileSelect} />

            <CompressionOptions
              compressionLevel={compressionLevel}
              setCompressionLevel={setCompressionLevel}
            />

            {error && (
              <div className="mb-4 rounded-2xl border border-[#F3B9B9] bg-[#FFF1F1] p-4 text-sm font-medium text-[#B42318]">
                {error}
              </div>
            )}

            {/* Compress button */}
            <button
              type="button"
              onClick={handleCompress}
              disabled={loading || !file}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#D94F8A] to-[#FF9A7B] px-5 py-4 font-bold text-white shadow-lg shadow-[#D94F8A]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D94F8A]/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <span className="relative z-10">
                {loading ? "Compressing..." : "Compress File"}
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <CompressionResult result={result} />
          </div>
        </main>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A98291]">
          Files are processed temporarily and automatically removed after
          processing or expiration.
        </p>
      </div>
    </div>
  );
}

export default App;
