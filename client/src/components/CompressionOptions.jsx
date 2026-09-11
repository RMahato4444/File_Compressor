function CompressionOptions({
    compressionLevel,
    setCompressionLevel,
}) {
    const options = [
        {
            value: "low",
            title: "Low",
            description: "Better quality",
        },
        {
            value: "medium",
            title: "Medium",
            description: "Balanced",
        },
        {
            value: "high",
            title: "High",
            description: "Smaller size",
        },
    ];

    return (
        <div className="mb-8">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-[#54213A]">
                    Compression level
                </h2>

                <p className="mt-1 text-sm text-[#9B6C7F]">
                    Choose how much you want to reduce the
                    file size.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {options.map((option) => {
                    const isActive =
                        compressionLevel === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                setCompressionLevel(
                                    option.value
                                )
                            }
                            className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
                                isActive
                                    ? "border-[#D94F8A] bg-gradient-to-br from-[#D94F8A] to-[#FF927C] text-white shadow-lg shadow-[#D94F8A]/20"
                                    : "border-[#F1D8DF] bg-[#FFF9FC] text-[#54213A] hover:-translate-y-1 hover:border-[#ED9DBB] hover:shadow-md"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold">
                                    {option.title}
                                </span>

                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                        isActive
                                            ? "border-white bg-white"
                                            : "border-[#E5B9CA]"
                                    }`}
                                >
                                    {isActive && (
                                        <span className="h-2 w-2 rounded-full bg-[#D94F8A]" />
                                    )}
                                </span>
                            </div>

                            <p
                                className={`mt-2 text-sm ${
                                    isActive
                                        ? "text-white/80"
                                        : "text-[#A07183]"
                                }`}
                            >
                                {option.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CompressionOptions;