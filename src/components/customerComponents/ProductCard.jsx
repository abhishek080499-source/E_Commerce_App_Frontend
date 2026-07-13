import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWishlist } from "../../redux/wishlistSlice";

function ProductCard({
  product,
  addToCart,
  wishlistItems = [],
}) {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  // Check if product exists in wishlist
  const isWishlisted = wishlistItems.some(
    (item) =>
      (item.productId?._id || item._id) === product._id
  );

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
          const refresh = await fetch(
            `${process.env.REACT_APP_API_URL}/wishlist`,
            {
              credentials: "include",
            }
          );

          const wishlistData = await refresh.json();

          if (wishlistData.success) {
            dispatch(setWishlist(wishlistData.wishlist));
          }
        }
      } else {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productId: product._id,
  }),
});

        const data = await res.json();

        if (data.success) {
          const refresh = await fetch(
            `${process.env.REACT_APP_API_URL}/wishlist`,
            {
              credentials: "include",
            }
          );

          const wishlistData = await refresh.json();

          if (wishlistData.success) {
            dispatch(setWishlist(wishlistData.wishlist));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col justify-between text-center transition duration-300 transform hover:scale-105 hover:shadow-xl">

      {/* Wishlist Button */}
<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleWishlist();
  }}
  className="absolute top-3 right-3 z-20 text-2xl bg-black dark:bg-gray-800 rounded-full p-2 hover:scale-110 transition"
>
  {isWishlisted ? "❤️" : "🤍"}
</button>

      {/* Image */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.itemName}
          onClick={() => setShowModal(true)}
          className="h-40 w-full object-contain mb-4 rounded-md cursor-pointer transition duration-300 hover:opacity-90"
        />
      ) : (
        <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 rounded-md">
          No Image
        </div>
      )}

      {/* Product Name */}
      <Link
        to={`/shop/${product._id}`}
        className="font-semibold text-lg mb-2 text-gray-900 dark:text-white hover:text-blue-600"
      >
        {product.itemName}
      </Link>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        {product.description || "No description available"}
      </p>

      {/* Price */}
      <p className="text-green-600 dark:text-green-400 font-bold mb-2">
        ₹{product.price}
      </p>

      {/* Stock */}
      <p
        className={`text-sm mb-4 ${
          product.availableQuantity === 0
            ? "text-red-600 font-semibold"
            : product.availableQuantity < 10
            ? "text-red-500 font-semibold"
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
            className="px-4 py-2 rounded w-full bg-gray-400 text-white cursor-not-allowed"
          >
            Unavailable
          </button>
        ) : (
          <>
            <button
              onClick={() => addToCart(product)}
              className="px-4 py-2 rounded w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-4 py-2 rounded w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Buy Now
            </button>
          </>
        )}
      </div>

      {/* Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
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
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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