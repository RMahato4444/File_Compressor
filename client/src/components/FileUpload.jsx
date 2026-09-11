import {
  FileImage,
  FileText,
  FileType,
  Presentation,
  UploadCloud,
} from "lucide-react";

function FileUpload({ file, onFileSelect }) {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onFileSelect(selectedFile);
  };

  const getFileExtension = (filename) => {
    return filename?.split(".").pop()?.toUpperCase();
  };

  const getFileType = () => {
    if (!file) {
      return null;
    }

    const extension = getFileExtension(file.name);

    if (["JPG", "JPEG", "PNG", "WEBP"].includes(extension)) {
      return "IMAGE";
    }

    if (extension === "PDF") {
      return "PDF";
    }

    if (extension === "DOCX") {
      return "WORD";
    }

    if (extension === "PPTX") {
      return "POWERPOINT";
    }

    return "FILE";
  };

  const renderFileIcon = () => {
    const type = getFileType();

    if (type === "IMAGE") {
      return <FileImage size={30} />;
    }

    if (type === "PDF" || type === "WORD") {
      return <FileText size={30} />;
    }

    if (type === "POWERPOINT") {
      return <Presentation size={30} />;
    }

    return <FileType size={30} />;
  };

  const getTypeLabel = () => {
    const type = getFileType();

    if (type === "IMAGE") {
      return "IMAGE";
    }

    if (type === "PDF") {
      return "PDF DOCUMENT";
    }

    if (type === "WORD") {
      return "WORD DOCUMENT";
    }

    if (type === "POWERPOINT") {
      return "POWERPOINT";
    }

    return "FILE";
  };

  return (
    <div className="mb-8">
      <label
        htmlFor="file-upload"
        className="group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed border-[#F0BFD0] bg-gradient-to-br from-[#FFF7FB] via-[#FFF4F7] to-[#FFF1E8] px-6 py-10 text-center transition-all duration-300 hover:border-[#D94F8A] hover:shadow-xl hover:shadow-[#D94F8A]/10"
      >
        <input
          id="file-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.pptx"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FFB38A]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />

        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#D94F8A]/15 blur-3xl transition-transform duration-500 group-hover:scale-125" />

        {file ? (
          <div className="relative flex w-full flex-col items-center gap-5">
            <div className="flex h-18 w-18 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#D94F8A] to-[#FF9A7B] text-white shadow-lg shadow-[#D94F8A]/20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2">
              {renderFileIcon()}
            </div>

            <div className="max-w-full">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C04478]">
                {getTypeLabel()}
              </p>

              <h3 className="mt-2 max-w-[500px] break-all text-lg font-bold text-[#54213A]">
                {file.name}
              </h3>

              <p className="mt-1 text-sm text-[#9B6C7F]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#C04478] shadow-sm ring-1 ring-[#F5DCE5]">
              Click to choose another file
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#D94F8A] via-[#EC739F] to-[#FFB38A] text-white shadow-xl shadow-[#D94F8A]/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-3">
              <UploadCloud size={32} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#54213A] sm:text-3xl">
              Drop your file here
            </h2>

            <p className="mt-2 text-sm text-[#8F6073]">
              or click to browse your files
            </p>

            <div className="mt-5 flex max-w-xl flex-wrap justify-center gap-2">
              {["JPG", "JPEG", "PNG", "WEBP", "PDF", "DOCX", "PPTX"].map(
                (type) => (
                  <span
                    key={type}
                    className="rounded-full border border-[#F3D7E2] bg-white px-3 py-1.5 text-xs font-bold text-[#B04472] shadow-sm"
                  >
                    {type}
                  </span>
                ),
              )}
            </div>

            <p className="mt-5 text-xs text-[#B58C9B]">
              Maximum file size: 25 MB
            </p>
          </div>
        )}
      </label>
    </div>
  );
}

export default FileUpload;
