import { CheckCircle2, Download, FileDown } from "lucide-react";

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function CompressionResult({ result }) {
  if (!result) {
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const downloadUrl = `${API_URL}${result.compressedFile.url}`;

  return (
    <div className="mt-8 border-t border-[#F3DFE6] pt-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#D94F8A] to-[#FFB38A] text-white shadow-lg shadow-[#D94F8A]/20">
          <CheckCircle2 size={28} />
        </div>

        <h2 className="mt-4 text-2xl font-bold text-[#54213A]">
          Compression complete
        </h2>

        <p className="mt-2 text-sm text-[#9B6C7F]">
          Your file has been compressed successfully and is ready to download.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#F4E0E7] bg-[#FFF9FC] p-5">
          <p className="text-sm text-[#9B6C7F]">Original size</p>

          <p className="mt-2 text-xl font-bold text-[#54213A]">
            {formatFileSize(result.originalFile.size)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#F4E0E7] bg-[#FFF9FC] p-5">
          <p className="text-sm text-[#9B6C7F]">Compressed size</p>

          <p className="mt-2 text-xl font-bold text-[#54213A]">
            {formatFileSize(result.compressedFile.size)}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#D94F8A] to-[#FF967B] p-5 text-white shadow-lg shadow-[#D94F8A]/15">
          <p className="text-sm text-white/80">You saved</p>

          <p className="mt-2 text-xl font-bold">{result.savings}%</p>
        </div>
      </div>

      <a
        href={downloadUrl}
        download
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#54213A] px-5 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#672746] hover:shadow-lg"
      >
        <Download size={20} />
        Download compressed file
      </a>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#A98291]">
        <FileDown size={14} />

        {result.compressedFile.name}
      </div>
    </div>
  );
}

export default CompressionResult;
