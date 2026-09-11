import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

export const compressFile = async (
    file,
    compressionLevel,
) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "compressionLevel",
        compressionLevel,
    );

    const response = await axios.post(
        `${API_URL}/api/compress`,
        formData,
    );

    return response.data;
};