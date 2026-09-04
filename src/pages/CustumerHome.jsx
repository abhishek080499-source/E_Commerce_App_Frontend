// src/pages/CustomerHome.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import SortNavbar from "../components/customerComponents/SortNavbar";
import CategoryNavbar from "../components/customerComponents/CategoryNavbar";
import HeroBanner from "../components/customerComponents/HeroBanner";
import ProductList from "../components/customerComponents/ProductList";
import Footer from "../components/customerComponents/Footer";

function CustomerHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===============================
  // Redux State
  // ===============================
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // ===============================
  // Local State
  // ===============================
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ===============================
  // User
  // ===============================
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ===============================
  // Fetch Products + Wishlist
  // ===============================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // ===============================
        // Fetch Products
        // ===============================
        const productsRes = await fetch(
          `${process.env.REACT_APP_API_URL}/products`,
          {
            credentials: "include",
          }
        );

        const productsData = await productsRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          setProducts([]);
        }

        // ===============================
        // Fetch Wishlist
        // ===============================
        const wishlistRes = await fetch(
          `${process.env.REACT_APP_API_URL}/wishlist`,
          {
            credentials: "include",
          }
        );

        const wishlistData = await wishlistRes.json();

        if (
          wishlistRes.ok &&
          wishlistData.success &&
          Array.isArray(wishlistData.wishlist)
        ) {
          dispatch(setWishlist(wishlistData.wishlist));
        } else {
          dispatch(setWishlist([]));
        }
      } catch (err) {
        console.error("Customer Home data error:", err);

        setProducts([]);
        dispatch(setWishlist([]));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dispatch]);

  // ===============================
  // Logout
  // ===============================
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

  // ===============================
  // Filter Products
  // ===============================
  // Search is NOT performed here.
  // Search is handled by CustomerNavbar
  // and redirects to /shop?search=...
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : product.category?._id === selectedCategory;

    return matchesCategory;
  });

  // ===============================
  // Sort Products
  // ===============================
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") {
      return a.price - b.price;
    }

    if (sortOption === "highToLow") {
      return b.price - a.price;
    }

    if (sortOption === "new") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortOption === "category") {
      return (a.category?.name || "").localeCompare(
        b.category?.name || ""
      );
    }

    return 0;
  });

  // ===============================
  // Featured Products
  // ===============================
  const categoryMap = new Map();

  sortedProducts.forEach((product) => {
    const catId = product.category?._id;

    if (catId && !categoryMap.has(catId)) {
      categoryMap.set(catId, product);
    }
  });

  const featuredProducts = Array.from(
    categoryMap.values()
  ).slice(0, 10);

  // ===============================
  // Render
  // ===============================
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

      {/* ================= HERO ================= */}
      <HeroBanner />

      {/* ================= LOADING ================= */}
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
        <>
          {/* ================= CATEGORY ================= */}
          <CategoryNavbar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* ================= SORT ================= */}
          <SortNavbar
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          {/* ================= PRODUCTS ================= */}
          <ProductList
            products={
              featuredProducts.length > 0
                ? featuredProducts
                : sortedProducts
            }
            loading={loading}
            wishlistItems={wishlistItems}
            addToCart={(product) =>
              dispatch(addToCart(product))
            }
          />
        </>
      )}

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default CustomerHome;