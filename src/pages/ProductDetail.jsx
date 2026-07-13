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
  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

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
        console.log(err);
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

        setProduct(data);
      } catch (err) {
        console.error(err);
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
      console.error(err);
    }

    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("theme");

    navigate("/login");
  };

  if (loading)
    return (
      <p className="text-center mt-10">
        Loading product...
      </p>
    );

  if (!product)
    return (
      <p className="text-center mt-10">
        Product not found.
      </p>
    );

  // =============================
  // Buy Now
  // =============================
  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  // =============================
  // Wishlist
  // =============================
  const isWishlisted = wishlistItems.some(
    (item) =>
      (item.productId?._id || item._id) === product._id
  );

  const refreshWishlist = async () => {
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
  };

  const handleWishlist = async () => {
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
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
        wishlistCount={wishlistItems.length}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-grow p-6">

        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">

          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.itemName}
              onClick={() => setShowModal(true)}
              className="h-64 w-full object-contain rounded-md cursor-pointer"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col justify-between">

            <div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.itemName}
              </h1>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {product.description}
              </p>

              <p className="text-2xl font-bold text-green-600 mb-4">
                ₹{product.price}
              </p>

              <p className="text-gray-600 dark:text-gray-400">
                Available Quantity :
                {" "}
                {product.availableQuantity}
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => dispatch(addToCart(product))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlist}
                className={`px-6 py-3 rounded-lg text-white ${
                  isWishlisted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {isWishlisted
                  ? "❤️ Remove Wishlist"
                  : "🤍 Add Wishlist"}
              </button>

            </div>
          </div>
        </div>
                {/* Image Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.imageUrl}
                alt={product.itemName}
                className="w-full h-auto object-contain"
              />

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Why Shop With Us */}
        <div className="max-w-6xl mx-auto mt-10 text-center text-gray-700 dark:text-gray-300">

          <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">
            Why Shop With Us?
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="font-semibold text-lg mb-2">
                🚚 Fast Delivery
              </h3>
              <p>
                Get your products delivered quickly with our trusted delivery
                partners.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="font-semibold text-lg mb-2">
                🔒 Secure Payments
              </h3>
              <p>
                Your payment information is protected with industry-standard
                encryption.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="font-semibold text-lg mb-2">
                🔄 Easy Returns
              </h3>
              <p>
                Enjoy our hassle-free 7-day return and replacement policy.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 className="font-semibold text-lg mb-2">
                💬 24/7 Support
              </h3>
              <p>
                Our customer support team is available anytime you need help.
              </p>
            </div>

          </div>

          <p className="mt-8 italic text-lg">
            "We bring joy to your doorstep, one product at a time."
          </p>

        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default ProductDetail;