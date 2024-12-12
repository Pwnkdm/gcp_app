import React, { useState, useEffect } from "react";
import axios from "axios";
import { bytesToMB } from "./Helper/HelpFunc";

const App = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const BASE_URL = "https://gcp-app-pearl.vercel.app";

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

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/metadata`);
      const updatedImages = await Promise.all(
        response.data.map(async (img) => {
          const { data } = await axios.get(`${BASE_URL}/file/${img.filename}`);
          return { ...img, url: data.url };
        })
      );
      setImages(updatedImages);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
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
                <span className="font-semibold">
                  Size: {bytesToMB(file?.size)}
                </span>{" "}
                MB
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

        {images?.length && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Uploaded Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images?.map((img) => (
                <div
                  key={"img.id"}
                  className="border rounded-lg p-4 bg-gray-50 shadow hover:shadow-lg transition duration-300"
                >
                  <img
                    src={img.url}
                    alt={"img.filename"}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Filename:</span>{" "}
                    {img.filename}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Size:</span> {img.size}{" "}
                    bytes
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Uploaded:</span>{" "}
                    {new Date("img.upload_timestamp").toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
