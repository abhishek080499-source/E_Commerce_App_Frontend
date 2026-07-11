// src/pages/AdminCategories.jsx
import React, { useEffect, useState } from "react";
import useCountUp from "../components/hook/UseCountUp"; 
import Pagination from "../components/Pagination";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data]);
        setNewCategory("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add category");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Start editing
  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(categories.map((c) => (c._id === id ? updated : c)));
        setEditId(null);
        setEditName("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update category");
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(categories.length / resultsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // ✅ Summary with countup
  const totalCategories = useCountUp(categories.length, 1200);

  if (loading) {
    return <p className="p-6 dark:text-white">Loading categories...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">All Categories</h1>

      {/* Summary */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 hover:shadow-lg transition">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">
            Total Categories: <span className="text-xl font-bold dark:text-white">{totalCategories}</span>
          </p>
        </div>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="border px-4 py-2 rounded flex-1 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        >
          Add Category
        </button>
      </form>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left dark:text-white">Category Name</th>
              <th className="px-6 py-3 text-left dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-600"
                >
                  <td className="px-6 py-4 dark:text-white">
                    {editId === cat._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {editId === cat._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(cat._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-gray-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(cat)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-red-400"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4 dark:text-white">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
}

export default Categories;
