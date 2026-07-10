import React, { useState } from "react";
import { useNavigate ,Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    // Add product to cart first
    addToCart(product);
    // Redirect to cart page
    navigate("/cart");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col justify-between text-center transition duration-300 transform hover:scale-105 hover:shadow-xl">
      {/* Image */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.itemName}
          onClick={() => setShowModal(true)}
          className="h-40 w-full object-contain mb-4 rounded-md cursor-pointer transition duration-300 hover:opacity-90"
        />
      ) : (
        <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 rounded-md text-gray-600 dark:text-gray-300">
          No Image
        </div>
      )}

      {/* Product Info */}
      <Link
        to={`/shop/${product._id}`} // ✅ navigate to ProductDetail page
        className="font-semibold text-lg mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-yellow-400 transition duration-300"
      >
        {product.itemName}
      </Link>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 hover:text-gray-800 dark:hover:text-gray-100 transition duration-300">
        {product.description || "No description available"}
      </p>
      <p className="text-green-600 dark:text-green-400 font-bold mb-2">₹{product.price}</p>

      {/* Stock Info */}
      <p
        className={`text-sm mb-4 ${
          product.availableQuantity === 0
            ? "text-red-700 dark:text-red-500 font-semibold"
            : product.availableQuantity < 10
            ? "text-red-600 dark:text-red-400 font-bold"
            : "text-gray-500 dark:text-gray-300"
        }`}
      >
        {product.availableQuantity === 0
          ? "Out of Stock"
          : product.availableQuantity < 10
          ? `Only ${product.availableQuantity} left`
          : `Available: ${product.availableQuantity}`}
      </p>

    {/* Buttons */}
<div className="mt-auto w-full flex flex-col sm:flex-row gap-3">
  {product.availableQuantity === 0 ? (
    <button
      disabled
      className="px-4 py-2 rounded w-full font-medium bg-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300"
    >
      Unavailable
    </button>
  ) : (
    <>
      <button
        onClick={() => addToCart(product)}
        className="px-4 py-2 rounded w-full font-medium bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition duration-300"
      >
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        className="px-4 py-2 rounded w-full font-medium bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition duration-300"
      >
        Buy Now
      </button>
    </>
  )}
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
    </div>
  );
}

export default ProductCard;
