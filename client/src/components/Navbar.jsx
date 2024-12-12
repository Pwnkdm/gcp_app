import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl font-bold">GCP App</h1>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-300">
            Upload Image
          </Link>
          <Link to="/uploadedImages" className="hover:text-gray-300">
            Uploaded Images
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
