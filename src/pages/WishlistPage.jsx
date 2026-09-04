
// src/pages/Wishlist.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setWishlist } from "../redux/wishlistSlice";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import ProductCard from "../components/customerComponents/ProductCard";
import Footer from "../components/customerComponents/Footer";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==============================
  // Redux State
  // ==============================
  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  // ==============================
  // User
  // ==============================
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ==============================
  // Local State
  // ==============================
  const [searchQuery, setSearchQuery] = useState("");

  // ==============================
  // Fetch Wishlist
  // ==============================
  const fetchWishlist = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/wishlist`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        dispatch(setWishlist(data.wishlist));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==============================
  // Logout
  // ==============================
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
      console.log(err);
    }
    navigate("/login");
  };

  // ==============================
  // Search Wishlist
  // ==============================
  const filteredWishlist = wishlistItems.filter((item) =>
    item.productId?.itemName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // ==============================
  // Cart Count
  // ==============================
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= MAIN ================= */}
      <main className="flex-grow">

        {/* ================= HEADER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <button
                  onClick={() => navigate("/customer")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Home
                </button>

                <span>›</span>

                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wishlist
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                ❤️ My Wishlist
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Products you've saved for later.
              </p>
            </div>

            {/* Wishlist Count */}
            {wishlistItems.length > 0 && (
              <div className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                ❤️ {wishlistItems.length}{" "}
                {wishlistItems.length === 1
                  ? "Product"
                  : "Products"}
              </div>
            )}

          </div>

        </section>

        {/* ================= PRODUCTS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          {filteredWishlist.length === 0 ? (

            /* ================= EMPTY ================= */
            <div className="min-h-[55vh] flex items-center justify-center">

              <div className="w-full max-w-lg text-center">

                <div className="mx-auto w-24 h-24 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-5xl shadow-sm">
                  ❤️
                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {wishlistItems.length === 0
                    ? "Your Wishlist is Empty"
                    : "No Products Found"}
                </h2>

                <p className="mt-3 text-gray-500 dark:text-gray-400 leading-6">
                  {wishlistItems.length === 0
                    ? "Save products you love and easily find them here whenever you're ready to shop."
                    : "Try searching with a different product name."}
                </p>

                <button
                  onClick={() => navigate("/customer")}
                  className="mt-7 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  🛍️ Continue Shopping
                </button>

              </div>

            </div>

          ) : (

            /* ================= PRODUCT GRID ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

              {filteredWishlist.map((item) => {
                const product = item.productId;

                if (!product) return null;

                return (
                  <ProductCard
                    key={product._id}
                    product={product}
                    wishlistItems={wishlistItems}
                    addToCart={(product) =>
                      dispatch({
                        type: "cart/addToCart",
                        payload: product,
                      })
                    }
                  />
                );
              })}

            </div>

          )}

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default Wishlist;

