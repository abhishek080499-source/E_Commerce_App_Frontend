import React, { useState } from "react";

function SortNavbar({ sortOption, setSortOption }) {
  const [isOpen, setIsOpen] = useState(false);

  const sortLabels = {
    default: "Default",
    lowToHigh: "Price: Low to High",
    highToLow: "Price: High to Low",
    new: "Newly Added",
  };

  const currentLabel = sortLabels[sortOption] || sortLabels.default;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md relative  ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Dropdown Sort */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Sort by: {currentLabel}
          </button>
          {isOpen && (
            <ul className="absolute left-0 top-full mt-2 bg-white text-black rounded shadow-lg w-48 z-50 animate-fadeIn">
              {Object.entries(sortLabels).map(([key, label]) => (
                <li
                  key={key}
                  className={`px-4 py-2 cursor-pointer transition duration-200 hover:bg-gray-200 ${
                    sortOption === key ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSortOption(key);
                    setIsOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Extra Info Text */}
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
          <span className="bg-gray-800 px-3 py-1 rounded transition duration-300 hover:bg-gray-700">
            7 Days Easy Return
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded transition duration-300 hover:bg-gray-700">
            Cash on Delivery
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded transition duration-300 hover:bg-gray-700">
            Lowest Prices
          </span>
        </div>
      </div>
    </nav>
  );
}

export default SortNavbar;
