import React from "react";
import moment from "moment";
import { bytesToMB } from "../Helper/HelpFunc";
import deleteIcon from "../assets/delete.png";
import axios from "axios";

const UploadedImages = ({ images, setImages }) => {
  const BASE_URL = "https://gcp-app-pearl.vercel.app";

  const onDelete = async (filename) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/delete/${filename}`);
      console.log("Delete response:", response.data);
      alert(`File ${filename} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(`Failed to delete the file: ${filename}`);
    }

    setImages((prev) => prev.filter((file) => file.filename !== filename));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Uploaded Images
      </h1>
      {console.log(images)}

      {images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border rounded-lg p-4 bg-gray-50 shadow hover:shadow-lg transition duration-300"
            >
              <img
                src={img.url}
                alt={img.filename}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Filename:</span> {img.filename}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Size:</span>{" "}
                {bytesToMB(img.size)} MB
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Uploaded:</span>{" "}
                {moment(img.timestamp, moment.ISO_8601)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a")}
              </p>
              {/* Delete Icon */}
              <img
                src={deleteIcon}
                alt="Delete"
                className="absolute bottom-3 right-3 w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => onDelete(img.filename)} // Add your delete handler here
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No images uploaded yet.</p>
      )}
    </div>
  );
};

export default UploadedImages;
