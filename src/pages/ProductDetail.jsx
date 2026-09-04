// src/pages/ProductDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../redux/cartSlice";
import { setWishlist } from "../redux/wishlistSlice";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function ProductDetail() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // =============================
  // Load Wishlist
  // =============================
  useEffect(() => {
    async function loadWishlist() {
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
        console.error("Wishlist error:", err);
      }
    }

    loadWishlist();
  }, [dispatch]);

  // =============================
  // Load Product
  // =============================
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/products/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Product error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // =============================
  // Logout
  // =============================
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
      console.error("Logout error:", err);
    }


    navigate("/login");
  };

  // =============================
  // Buy Now
  // =============================
  const handleBuyNow = () => {
    if (product?.availableQuantity <= 0) return;

    dispatch(addToCart(product));
    navigate("/cart");
  };

  // =============================
  // Wishlist
  // =============================
  const isWishlisted = wishlistItems.some(
    (item) =>
      (item.productId?._id || item._id) === product?._id
  );

  const refreshWishlist = async () => {
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
      console.error("Refresh wishlist error:", err);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    try {
      if (isWishlisted) {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/wishlist/${product._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          await refreshWishlist();
        }
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/wishlist`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product._id,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          await refreshWishlist();
        }
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

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

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="min-h-[75vh] flex items-center justify-center px-4">
            <div className="flex flex-col items-center">

              <div className="relative flex items-center justify-center">

                <div className="absolute w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-ping opacity-40"></div>

                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>

                <div className="absolute w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>

              </div>

              <p className="mt-7 text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
                Loading product...
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please wait a moment
              </p>

            </div>
          </div>
        )}

        {/* ================= PRODUCT NOT FOUND ================= */}
        {!loading && !product && (
          <div className="min-h-[75vh] flex items-center justify-center px-4">

            <div className="text-center">

              <div className="text-6xl mb-4">
                📦
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Product Not Found
              </h2>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Sorry, this product is no longer available.
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"
              >
                ← Back to Shop
              </button>

            </div>

          </div>
        )}

        {/* ================= PRODUCT ================= */}
        {!loading && product && (
          <>

            {/* ================= BREADCRUMB ================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 overflow-hidden">

                <button
                  onClick={() => navigate("/customer")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition shrink-0"
                >
                  Home
                </button>

                <span>›</span>

                <button
                  onClick={() => navigate("/shop")}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition shrink-0"
                >
                  Shop
                </button>

                <span>›</span>

                <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                  {product.itemName}
                </span>

              </div>

            </div>

            {/* ================= PRODUCT SECTION ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

                <div className="grid grid-cols-1 lg:grid-cols-2">

                  {/* ================= IMAGE SECTION ================= */}
                  <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

                    {/* Image area */}
                    <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[560px] flex items-center justify-center p-12 sm:p-14 lg:p-16">

                      {/* Product Badge */}
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                          ✨ Product
                        </span>
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={handleWishlist}
                        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                          isWishlisted
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white dark:bg-gray-800 text-pink-500 hover:bg-pink-50 dark:hover:bg-gray-700"
                        }`}
                        title={
                          isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        {isWishlisted ? "❤️" : "🤍"}
                      </button>

                      {/* Image Background */}
                      <div className="absolute w-52 h-52 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-white/70 dark:bg-gray-800/60 rounded-full blur-2xl"></div>

                      {/* Product Image */}
                      <div
                        className="relative z-10 w-full h-[240px] sm:h-[320px] lg:h-[400px] flex items-center justify-center cursor-zoom-in group"
                        onClick={() => setShowModal(true)}
                      >

                        <img
                          src={product.imageUrl}
                          alt={product.itemName}
                          className="max-h-full max-w-full object-contain drop-shadow-xl transition duration-500 group-hover:scale-105"
                        />

                        {/* Zoom text */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 text-xs px-4 py-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                          🔍 Click to enlarge
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ================= PRODUCT DETAILS ================= */}
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

                    {/* Category */}
                    {product.category?.name && (
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          {product.category.name}
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                      {product.itemName}
                    </h1>

                    {/* Trust */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">

                      <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Trusted Product
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Secure & reliable shopping
                      </span>

                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-7 text-base">
                        {product.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-7 flex items-end gap-3 flex-wrap">

                      <span className="text-4xl font-extrabold text-green-600 dark:text-green-400">
                        ₹{product.price}
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Inclusive price
                      </span>

                    </div>

                    {/* Stock */}
                    <div className="mt-5">

                      {product.availableQuantity > 0 ? (
                        <div className="inline-flex max-w-full flex-wrap items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl">

                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>

                          <span className="font-semibold">
                            In Stock
                          </span>

                          <span className="text-sm">
                            • {product.availableQuantity} available
                          </span>

                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl">

                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0"></span>

                          <span className="font-semibold">
                            Out of Stock
                          </span>

                        </div>
                      )}

                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-7"></div>

                    {/* Main Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <button
                        onClick={() => dispatch(addToCart(product))}
                        disabled={product.availableQuantity <= 0}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg"
                      >
                        🛒 Add to Cart
                      </button>

                      <button
                        onClick={handleBuyNow}
                        disabled={product.availableQuantity <= 0}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-md hover:shadow-lg"
                      >
                        ⚡ Buy Now
                      </button>

                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={handleWishlist}
                      className={`mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border transition ${
                        isWishlisted
                          ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : "border-pink-300 bg-pink-50 text-pink-600 hover:bg-pink-100 dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
                      }`}
                    >
                      {isWishlisted
                        ? "❤️ Remove from Wishlist"
                        : "🤍 Add to Wishlist"}
                    </button>

                    {/* Benefits */}
                    <div className="grid grid-cols-3 gap-2 mt-7">

                      <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div className="text-xl mb-1">
                          🚚
                        </div>

                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Fast Delivery
                        </p>
                      </div>

                      <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div className="text-xl mb-1">
                          🔒
                        </div>

                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Secure
                        </p>
                      </div>

                      <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div className="text-xl mb-1">
                          🔄
                        </div>

                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Easy Returns
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ================= WHY SHOP WITH US ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">

              <div className="text-center mb-8">

                <span className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Shop With Confidence
                </span>

                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Why Shop With Us?
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Everything you need for a simple and secure shopping experience.
                </p>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-2xl group-hover:scale-110 transition">
                    🚚
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    Fast Delivery
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Get your products delivered quickly with our trusted delivery partners.
                  </p>

                </div>

                <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 text-2xl group-hover:scale-110 transition">
                    🔒
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    Secure Payments
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Your payment information is protected with industry-standard encryption.
                  </p>

                </div>

                <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-900/30 text-2xl group-hover:scale-110 transition">
                    🔄
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    Easy Returns
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Enjoy our hassle-free 7-day return and replacement policy.
                  </p>

                </div>

                <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-2xl group-hover:scale-110 transition">
                    💬
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                    24/7 Support
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Our customer support team is available whenever you need help.
                  </p>

                </div>

              </div>

              <div className="mt-10 text-center">

                <div className="inline-block px-6 py-4 bg-gradient-to-r from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">

                  <p className="italic text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                    "We bring joy to your doorstep, one product at a time."
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

      </main>

      {/* ================= IMAGE MODAL ================= */}
      {showModal && product && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setShowModal(false)}
        >

          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-lg shadow-lg transition"
              title="Close"
            >
              ✕
            </button>

            <div className="flex items-center justify-center min-h-[300px] max-h-[75vh]">

              <img
                src={product.imageUrl}
                alt={product.itemName}
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />

            </div>

            <div className="text-center mt-4">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {product.itemName}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click outside to close
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default ProductDetail;
