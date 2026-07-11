// src/pages/AllProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import useCountUp from "../components/hook/UseCountUp";
import Pagination from "../components/Pagination";

function AllProducts() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category?._id === selectedCategory);
    }

    if (sortOrder === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, sortOrder]);

  const totalResults = filteredProducts.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const data = filteredProducts.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  // ✅ Summary values with countup
  const totalProducts = useCountUp(products.length, 1200);
  const highestPrice = useCountUp(Math.max(...products.map((p) => p.price), 0), 1200);
  const averagePrice = useCountUp(
    Number(
      (
        products.reduce((sum, p) => sum + p.price, 0) /
        (products.length || 1)
      ).toFixed(2)
    ),
    1200
  );
  const totalRevenue = useCountUp(
    products.reduce((sum, p) => sum + p.price, 0),
    1200
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Products Data</h1>

      {/* ✅ Summary Cards */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 hover:shadow-lg transition">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Products</p>
          <p className="text-xl font-bold dark:text-white">{totalProducts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 hover:shadow-lg transition">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Highest Price</p>
          <p className="text-xl font-bold dark:text-white">₹{highestPrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 hover:shadow-lg transition">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Average Price</p>
          <p className="text-xl font-bold dark:text-white">₹{averagePrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-105 hover:shadow-lg transition">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Revenue</p>
          <p className="text-xl font-bold dark:text-white">₹{totalRevenue}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6 dark:text-gray-200">All Products</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto mb-6 rounded-lg shadow-md">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left dark:text-white">Image</th>
              <th className="px-4 py-2 text-left dark:text-white">Item Name</th>
              <th className="px-4 py-2 text-left dark:text-white">Description</th>
              <th className="px-4 py-2 text-left dark:text-white">Available Quantity</th>
              <th className="px-4 py-2 text-left dark:text-white">Price (₹)</th>
              <th className="px-4 py-2 text-left dark:text-white">Category</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {data.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-600"
              >
                <td className="px-4 py-2">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.itemName}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="px-4 py-2 font-semibold truncate max-w-xs dark:text-white">{p.itemName}</td>
                <td className="px-4 py-2 whitespace-normal break-words max-w-md dark:text-gray-200">{p.description}</td>
                <td className="px-4 py-2 dark:text-white">{p.availableQuantity}</td>
                <td className="px-4 py-2 text-green-600 font-bold">₹ {p.price}</td>
                <td className="px-4 py-2 truncate max-w-xs dark:text-white">{p.category?.name || "No category"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default AllProducts;
