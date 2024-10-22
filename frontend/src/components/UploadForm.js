import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("docx");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await axios.post("http://localhost:5000/convert", formData, {
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `converted.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error during conversion:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Upload PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Select Format:</label>
          <select
            value={format}
            onChange={handleFormatChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Convert
        </button>

        {progress > 0 && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-2">{progress}%</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
