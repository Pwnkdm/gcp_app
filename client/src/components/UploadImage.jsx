import React, { useState } from "react";
import axios from "axios";
import { bytesToMB } from "../Helper/HelpFunc";

const UploadImage = ({ fetchImages }) => {
  const [file, setFile] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid image file!");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected for upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image uploaded successfully!");
      setFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the image.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Image Uploader
      </h1>
      {!file ? (
        <div className="flex flex-col sm:flex-row items-center justify-center border-2 border-dashed border-gray-400 p-6 rounded-lg bg-gray-50">
          <label className="cursor-pointer text-gray-600 text-center sm:text-left">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <span className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
              Select an Image
            </span>
          </label>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            className="w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0"
          />
          <div className="text-sm text-gray-700">
            <p>
              <span className="font-semibold">Filename:</span> {file.name}
            </p>
            <p>
              <span className="font-semibold">Size:</span>{" "}
              {bytesToMB(file.size)} MB
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`w-full mt-6 px-4 py-2 text-white rounded-lg shadow ${
          file
            ? "bg-green-500 hover:bg-green-600 transition duration-300"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadImage;
