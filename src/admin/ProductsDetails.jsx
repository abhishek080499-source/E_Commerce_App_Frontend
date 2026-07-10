// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import useCountUp from "../components/hook/UseCountUp"; // ✅ countup hook import
import Pagination from "../components/Pagination"; 

function ProductDetail() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
   const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [selectedCategory, sortOrder]);


  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/products", {
        credentials: "include",
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data.map((p) => ({ ...p, price: Number(p.price) || 0 })));
      } else if (Array.isArray(data.products)) {
        setProducts(
          data.products.map((p) => ({ ...p, price: Number(p.price) || 0 }))
        );
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:5000/categories", {
        credentials: "include",
      });
      const cats = await res.json();
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  // ✅ Apply filters
  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category?._id === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });


     const totalPages = Math.ceil(filteredProducts.length / resultsPerPage);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

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
      <h1 className="text-2xl font-bold mb-6 dark:text-white">All Products Details</h1>

      {/* ✅ Summary Cards */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Products</p>
          <p className="text-xl font-bold dark:text-white">{totalProducts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Highest Price</p>
          <p className="text-xl font-bold dark:text-white">₹{highestPrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Average Price</p>
          <p className="text-xl font-bold dark:text-white">₹{averagePrice}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Revenue</p>
          <p className="text-xl font-bold dark:text-white">₹{totalRevenue}</p>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-400"
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
          onChange={(e) => setSortOrder(e.target.value)}
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* ✅ Products Grid */}
      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {paginated.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded p-4 flex flex-col items-center text-center 
                       transition transform hover:scale-105 hover:shadow-lg"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.itemName}
                className="h-32 w-32 object-cover rounded mb-4"
              />
            ) : (
              <div className="h-32 w-32 flex items-center justify-center bg-gray-200 text-gray-500 mb-4">
                No Image
              </div>
            )}

            <p className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              {product.itemName}
            </p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {product.description || "No description available"}
            </p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Stock: {product.availableQuantity ?? 0}
            </p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Category: {product.category?.name || "No category"}
            </p>
            <p className="text-gray-700 dark:text-gray-200 font-bold">
              Price: ₹{product.price}
            </p>
          </div>
        ))}
      </div>
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
}

export default ProductDetail;
