import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <>
      <style>{`body { background-color: whitesmoke; }`}</style>

      <nav className="flex justify-between items-center px-8 py-4 bg-white fixed top-0 w-full z-50 h-[12vh] shadow-md">
        <div className="navbar-left">
          <ul className="flex list-none p-0 m-0">
            <li className="mr-6">
              <Link to="/" className="text-black text-lg font-bold no-underline">
                JobFinder
              </Link>
            </li>
            <li className="mr-6">
              <Link to="/add-job" className="text-black text-lg font-bold no-underline">
                Add Job
              </Link>
            </li>
            <li className="mr-6">
              <Link to="/add-company" className="text-black text-lg font-bold no-underline">
                Add Company
              </Link>
            </li>
            <li className="mr-6">
              <Link to="/about" className="text-black text-lg font-bold no-underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-right ml-auto flex items-center">
          <div className="flex items-center gap-8">
            <input
              type="text"
              placeholder="Search for jobs..."
              className="px-3 py-2 border-2 border-gray-800 rounded-l-md w-72 outline-none focus:ring-2 focus:ring-green-400"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-r-md font-bold transition-all duration-300 hover:bg-green-800"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
