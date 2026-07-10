import React, { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import Notification from "../admin/Notifications";
import useCountUp from "../components/hook/UseCountUp"; 

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register required chart elements and scales
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);



function Dashboard() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // edit states
  const [editItemName, setEditItemName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);

  // category states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editCategoryId, setEditCategoryId] = useState("");

  // search + notifications
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const resultsPerPage = 5;

  

  // fetch products
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/products", {
        credentials: "include",
      });
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  // delete product
  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // start edit
  function startEdit(product) {
    setEditingId(product._id);
    setEditItemName(product.itemName);
    setEditDescription(product.description || "");
    setEditQuantity(product.availableQuantity || 0);
    setEditPrice(product.price);
    setEditImage(null);
    setEditCategoryId(product.category?._id || "");
  }

  // save edit
  async function saveEdit(id) {
    try {
      const formData = new FormData();
      formData.append("itemName", editItemName);
      formData.append("description", editDescription);
      formData.append("availableQuantity", editQuantity);
      formData.append("categoryId", editCategoryId);
      formData.append("price", editPrice);
      if (editImage) formData.append("image", editImage);

      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        alert("Product updated!");
        setEditingId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  // helper: generate distinct colors
  function generateColors(count) {
    return Array.from({ length: count }, (_, i) => {
      const hue = (i * 360) / count;
      return `hsl(${hue}, 70%, 50%)`;
    });
  }

  // sort state
  const [sortOrder, setSortOrder] = useState("none");

  // fetch categories
  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:5000/categories", {
        credentials: "include",
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  // call both fetches on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  

  // filter + sort products
  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category?._id === selectedCategory
    )
    .filter((p) =>
      p.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const totalResults = filteredProducts.length;

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortOrder]);

  // category-level data
  const categoryMap = new Map();
  filteredProducts.forEach((p) => {
    const catName = p.category?.name || "Uncategorized";
    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, { totalPrice: 0, totalQuantity: 0 });
    }
    categoryMap.get(catName).totalPrice += Number(p.price) || 0;
    categoryMap.get(catName).totalQuantity += Number(p.availableQuantity) || 0;
  });

  const categoryLabels = Array.from(categoryMap.keys());
  const categoryPriceValues = Array.from(categoryMap.values()).map(
    (c) => c.totalPrice
  );
  const categoryQuantityValues = Array.from(categoryMap.values()).map(
    (c) => c.totalQuantity
  );

  // Doughnut chart (Revenue by Category)
  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryPriceValues,
        backgroundColor: generateColors(categoryLabels.length),
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "30%",
    plugins: { legend: { display: false } },
  };

  // Bar chart (Stock by Category)
  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Category Quantities",
        data: categoryQuantityValues,
        backgroundColor: "#42A5F5",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  // पहले values calculate करें
const totalProducts = filteredProducts.length;
const highestPrice = Math.max(...filteredProducts.map((p) => p.price), 0);
const averagePrice = (
  filteredProducts.reduce((sum, p) => sum + p.price, 0) /
  (filteredProducts.length || 1)
).toFixed(2);
const totalRevenue = filteredProducts.reduce((sum, p) => sum + p.price, 0);

// ✅ useCountUp hook से animated values
const animatedTotalProducts = useCountUp(totalProducts, 1200);
const animatedHighestPrice = useCountUp(highestPrice, 1200);
const animatedAveragePrice = useCountUp(Number(averagePrice), 1200);
const animatedTotalRevenue = useCountUp(totalRevenue, 1200);



return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>


{/* Summary Cards */}
<div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
  {/* Total Products */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow 
                  transition transform hover:scale-105 hover:shadow-lg">
    <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Products</p>
    <p className="text-xl font-bold dark:text-white">{animatedTotalProducts}</p>
  </div>

  {/* Highest Price */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow 
                  transition transform hover:scale-105 hover:shadow-lg">
    <p className="text-gray-700 dark:text-gray-200 font-semibold">Highest Price</p>
    <p className="text-xl font-bold dark:text-white">₹{animatedHighestPrice}</p>
  </div>

  {/* Average Price */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow 
                  transition transform hover:scale-105 hover:shadow-lg">
    <p className="text-gray-700 dark:text-gray-200 font-semibold">Average Price</p>
    <p className="text-xl font-bold dark:text-white">₹{animatedAveragePrice}</p>
  </div>

  {/* Total Revenue */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow 
                  transition transform hover:scale-105 hover:shadow-lg">
    <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Revenue</p>
    <p className="text-xl font-bold dark:text-white">₹{animatedTotalRevenue}</p>
  </div>

</div>


{/* Search + Filters */}
<div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow flex flex-col gap-4">
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
  />

  {/* Filters row */}
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Category Filter */}
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
    >
      <option value="All">All Categories</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>

    {/* Sort Filter */}
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
    >
      <option value="none">Sort by</option>
      <option value="low">Price: Low → High</option>
      <option value="high">Price: High → Low</option>
      <option value="newest">Newest</option>
    </select>
  </div>
</div>

{/* Notifications Toggle */}
<div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-2  ">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 "
  >
    {showNotifications ? "Hide Notifications" : "Show Notifications"}
  </button>
</div>

{showNotifications && <Notification />}


    {/* Products Table */}
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left dark:text-white
            ">Image</th>
            <th className="px-4 py-2 text-left dark:text-white">Item Name</th>
            <th className="px-4 py-2 text-left dark:text-white">Description</th>
            <th className="px-4 py-2 text-left dark:text-white">Quantity</th>
            <th className="px-4 py-2 text-left dark:text-white">Price</th>
            <th className="px-4 py-2 text-left dark:text-white">Category</th>
            <th className="px-4 py-2 text-left dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 dark:text-white">
          {paginatedProducts.map((p) => (
            <tr key={p._id} className="border-t">
              {/* Image */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                  />
                ) : p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.itemName}
                    className="h-16 w-16 object-cover rounded  dark:text-black"
                  />
                ) : (
                  "No image"
                )}
              </td>

              {/* Item Name */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <input
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    className="border px-2 py-1 rounded  dark:text-black"
                  />
                ) : (
                  p.itemName
                )}
              </td>

              {/* Description */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border px-2 py-1 rounded  dark:text-black"
                  />
                ) : (
                  p.description || "—"
                )}
              </td>

              {/* Quantity */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="border px-2 py-1 rounded  dark:text-black"
                  />
                ) : (
                  p.availableQuantity ?? 0
                )}
              </td>

              {/* Price */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="border px-2 py-1 rounded  dark:text-black"
                  />
                ) : (
                  `₹ ${p.price}`
                )}
              </td>

              {/* Category */}
              <td className="px-4 py-2">
                {editingId === p._id ? (
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="border px-2 py-1 rounded  dark:text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  p.category?.name || "No category"
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 space-x-2">
                {editingId === p._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(p._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center mb-8">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {page} of {Math.ceil(totalResults / resultsPerPage)}
      </span>
      <div className="space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50">
          Prev
        </button>
        <button
          disabled={page >= Math.ceil(totalResults / resultsPerPage)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
{/* Charts Section */}
<h2 className="text-xl font-bold mb-6 dark:text-white">Charts</h2>
<div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2">
  {/* Revenue Doughnut */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Revenue</h3>
    <div className="flex justify-center">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      {categoryLabels.map((cat, i) => (
        <div key={cat} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}
          ></span>
          <span className="text-sm dark:text-gray-200">{cat}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Stock Bar Chart */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Stock by Category</h3>
    <div className="w-full h-64 sm:h-72 md:h-96">
      <Bar data={barData} options={barOptions} />
    </div>
    <div className="mt-4 space-y-2">
      {categoryLabels.map((cat) => (
        <div key={cat} className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-sm dark:text-gray-200">{cat}</span>
        </div>
      ))}
    </div>
  </div>
</div>
  </div>
)
}
export default Dashboard;