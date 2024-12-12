import React from "react";
import moment from "moment";

const UploadedImages = ({ images }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Uploaded Images
      </h1>
      {images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="border rounded-lg p-4 bg-gray-50 shadow hover:shadow-lg transition duration-300"
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
                <span className="font-semibold">Size:</span> {img.size} bytes
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Uploaded:</span>{" "}
                {moment(img.upload_timestamp)
                  .local()
                  .format("MMMM Do YYYY, h:mm:ss a")}
              </p>
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
