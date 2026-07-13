import React, { useState, useEffect } from "react";

function CategoryNavbar({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/categories`,
          { credentials: "include" }
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Top 10 categories for quick buttons
  const topCategories = categories.slice(0, 10);

  return (
    <div  
            // sticky  top-[72px]   /* adjust to your navbar  if stick
      className="
        height */
        z-40 
        bg-white dark:bg-gray-900 
        shadow-md 
        px-6 py-4 
        flex flex-wrap gap-3
      "
    >
      {/* Dropdown for all categories */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border px-3 py-2 rounded 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition duration-300 
                   bg-white dark:bg-gray-800 
                   text-gray-800 dark:text-white 
                   hover:border-blue-400"
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Quick buttons: All + Top 10 */}
      <button
        onClick={() => setSelectedCategory("All")}
        className={`px-4 py-2 rounded-lg border transition duration-300 transform hover:scale-105 
          ${
            selectedCategory === "All"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
      >
        All
      </button>

      {topCategories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setSelectedCategory(cat._id)}
          className={`px-4 py-2 rounded-lg border transition duration-300 transform hover:scale-105 
            ${
              selectedCategory === cat._id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryNavbar;
