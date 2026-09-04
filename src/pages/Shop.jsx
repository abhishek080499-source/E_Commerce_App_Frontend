
// src/pages/Shop.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../redux/cartSlice";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import SortNavbar from "../components/customerComponents/SortNavbar";
import CategoryNavbar from "../components/customerComponents/CategoryNavbar";
import ProductList from "../components/customerComponents/ProductList";
import Footer from "../components/customerComponents/Footer";

function Shop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Local State
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ==========================
  // Fetch Products
  // ==========================
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/products`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ==========================
  // Logout
  // ==========================
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error(err);
    }


    navigate("/login");
  };

  // ==========================
  // Search + Category Filter
  // ==========================
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.itemName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================
  // Sorting
  // ==========================
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.price - b.price;

    if (sortOption === "highToLow") return b.price - a.price;

    if (sortOption === "new")
      return new Date(b.createdAt) - new Date(a.createdAt);

    if (sortOption === "category")
      return (a.category?.name || "").localeCompare(
        b.category?.name || ""
      );

    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= SORT ================= */}
      <SortNavbar
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ================= CATEGORY ================= */}
      <CategoryNavbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* ================= LOADING / PRODUCTS ================= */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center justify-center">

            {/* Spinner */}
            <div className="relative flex items-center justify-center">

              {/* Outer pulse */}
              <div className="absolute w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-ping opacity-50"></div>

              {/* Rotating spinner */}
              <div className="w-14 h-14 border-4 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>

              {/* Center dot */}
              <div className="absolute w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            {/* Loading text */}
            <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
              Loading products...
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please wait a moment
            </p>
          </div>
        </div>
      ) : (
        <ProductList
          products={sortedProducts}
          loading={loading}
          wishlistItems={wishlistItems}
          addToCart={(product) =>
            dispatch(addToCart(product))
          }
        />
      )}

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Shop;