import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWishlist } from "../../redux/wishlistSlice";
import { apiFetch } from "../../api";

function ProductCard({
  product,
  addToCart,
  wishlistItems = [],
}) {
  const [showModal, setShowModal] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showName, setShowName] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);

    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setJustAdded(false), 1500);
  };

  // Check if product exists in wishlist
  const isWishlisted = wishlistItems.some(
    (item) =>
      (item.productId?._id || item._id) === product._id
  );

  const handleWishlist = async () => {
    if (wishlistLoading) return;
    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        const res = await apiFetch(
          `${process.env.REACT_APP_API_URL}/wishlist/${product._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          const refresh = await apiFetch(
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
        const res = await apiFetch(
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
          const refresh = await apiFetch(
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
    } finally {
      setWishlistLoading(false);
    }
  };

  const isOut = product.availableQuantity === 0;
  const isLow = !isOut && product.availableQuantity < 10;

  return (          
    <div
      className="
        group relative h-full flex flex-col
        bg-white dark:bg-gray-900
        border border-gray-200 
        hover:bg-gray-300
        hover:dark:bg-gray-800 dark:border-gray-700
        rounded-[6px]
        transition-shadow duration-300 ease-out
        hover:shadow-[0_10px_28px_-12px_rgba(59,130,246,0.30)]
        dark:hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.6)]
      "
    >
      {/* Thin inner keyline for a bit of depth without gradients */}
      <div className="pointer-events-none absolute inset-[3px] rounded-[4px] border border-gray-300 dark:border-gray-800 " />

      {/* Wishlist */}
      <button
        disabled={wishlistLoading}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleWishlist();
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 text-base transition active:scale-90 ${
          wishlistLoading ? "opacity-50 cursor-not-allowed" : "hover:border-yellow-400"
        }`}
      >
        {wishlistLoading ? "⏳" : isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Stock tag, top-left */}
      {isOut && (
        <span className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-[3px] bg-red-500 text-white">
          Out of stock
        </span>
      )}
      {isLow && (
        <span className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-[3px] bg-yellow-400 text-gray-900">
          {`${product.availableQuantity} left`}
        </span>
      )}

      {/* Image, framed like a plate */}
      <div className="px-5 pt-5">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.itemName}
            onClick={() => setShowModal(true)}
            className="h-40 w-full object-contain cursor-pointer border-b border-gray-100 dark:border-gray-800 pb-4 transition duration-300 hover:opacity-90 active:opacity-80"
          />
        ) : (
          <div className="h-40 w-full flex items-center justify-center border-b border-gray-100 dark:border-gray-800 pb-4 text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-5 pb-5 pt-4 text-left">
        {/* Name */}
        <div className="mb-1.5 min-w-0">
          <Link
            to={`/shop/${product._id}`}
            className={`font-serif text-lg leading-snug text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 [overflow-wrap:anywhere] ${
              showName ? "block" : "line-clamp-2"
            }`}
          >
            {product.itemName.toUpperCase()}
          </Link>

          {product.itemName && product.itemName.length > 50 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowName((prev) => !prev);
              }}
              className="text-blue-500 dark:text-blue-400 hover:text-yellow-500 dark:hover:text-yellow-400 text-xs mt-1"
            >
              {showName ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <p
            onClick={() => setShowDescription(!showDescription)}
            className={`text-gray-500 dark:text-gray-400 text-sm cursor-pointer [overflow-wrap:anywhere] ${
              showDescription ? "" : "line-clamp-2"
            }`}
          >
            {product.description || "No description available"}
          </p>

          {product.description && product.description.length > 60 && (
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-blue-500 dark:text-blue-400 hover:text-yellow-500 dark:hover:text-yellow-400 text-xs mt-1"
            >
              {showDescription ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="mt-auto">
          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 mb-3" />

          {/* Price + availability row */}
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-serif text-xl text-blue-500 dark:text-blue-400">
              ₹{product.price}
            </p>
            {!isOut && !isLow && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {product.availableQuantity} available
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {isOut ? (
              <button
                disabled
                className="px-4 py-2 rounded-[4px] w-full border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={justAdded}
                  className={`px-4 py-2 rounded-[4px] w-full border transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
                    justAdded
                      ? "border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-500"
                      : "border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <span className="inline-block animate-[bounce_0.4s_ease-in-out]">✓</span>
                      Added
                    </>
                  ) : (
                    "Add to cart"
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="px-4 py-2 rounded-[4px] w-full bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 transition hover:bg-yellow-400 hover:text-gray-900 dark:hover:bg-yellow-500 dark:hover:text-gray-900 active:scale-95"
                >
                  Buy now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-[6px] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.imageUrl}
              alt={product.itemName}
              className="w-full h-auto object-contain"
            />

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 border border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 px-4 py-2 rounded-[4px] hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-400 dark:hover:bg-yellow-500 dark:hover:text-gray-900 active:scale-95"
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