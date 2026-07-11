import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));
const username = user?.username;

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error(err);
    }
      localStorage.clear();
      localStorage.removeItem("user");
      localStorage.removeItem("theme");
    navigate("/login");
  };
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/products/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Navbar */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Product Content */}
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-1/2 w-full">
            <img
              src={product.imageUrl}
              alt={product.itemName}
              onClick={() => setShowModal(true)}
              className="h-64 w-full object-contain mb-4 rounded-md cursor-pointer transition duration-300 hover:opacity-90"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.itemName}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              <p className="text-xl font-semibold text-green-600 mb-4">
                ₹{product.price}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Available Quantity: {product.availableQuantity}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => dispatch(addToCart(product))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-semibold transform hover:scale-105"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition font-semibold transform hover:scale-105"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Modal for large image */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-3xl">
              <img
                src={product.imageUrl}
                alt={product.itemName}
                className="w-full h-auto object-contain"
              />
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Extra Section */}
        <div className="max-w-6xl mx-auto mt-8 text-center text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Why Shop With Us?
          </h2>
          <p className="mb-2">✅ Secure payments, fast delivery, and trusted sellers.</p>
          <p className="mb-2">✅ Thousands of products across categories to suit every lifestyle.</p>
          <p className="mb-2">✅ 7‑Day Easy Return Policy.</p>
          <p className="mb-2">✅ 24/7 Customer Support for all queries.</p>
          <p className="mb-2">✅ 100% Secure Checkout with SSL encryption.</p>
          <p className="italic">
            “We bring joy to your doorstep, one product at a time.”
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProductDetail;
