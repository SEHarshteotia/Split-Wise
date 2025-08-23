import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 z-20">
      <div className="flex justify-between items-center">
        {/* Brand Logo / Title */}
        <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
          Split<span className="text-gray-800">Easy</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link to="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
          <Link to="/" className="hover:text-blue-600 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center text-gray-700 hover:text-blue-600 transition"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white mt-3 rounded-lg shadow-lg p-4 space-y-2 text-gray-700 font-medium">
          <Link
            to="/about"
            className="block hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/"
            className="block hover:text-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;

