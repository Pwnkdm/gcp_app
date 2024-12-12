import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import UploadImage from "./components/UploadImage";
import UploadedImages from "./components/UploadedImages";

const App = () => {
  const [images, setImages] = useState([]);
  const BASE_URL = "https://gcp-app-pearl.vercel.app";

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/metadata`);
      const updatedImages = await Promise.all(
        response.data.map(async (img) => {
          const { data } = await axios.get(
            `${BASE_URL}/api/file/${img.filename}`
          );
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
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<UploadImage fetchImages={fetchImages} />} />
          <Route
            path="/uploadedImages"
            element={<UploadedImages images={images} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
