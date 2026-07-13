import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { addToCart } from "../redux/cartSlice";
import { setWishlist, removeWishlist } from "../redux/wishlistSlice";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  const [searchQuery, setSearchQuery] = useState("");
  
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist`, {
        credentials: "include",
      });
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

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        dispatch(removeWishlist(productId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }
    localStorage.clear();
    navigate("/login");
  };

  const filteredWishlist = wishlistItems.filter((item) =>
    item.productId?.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto w-full p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">❤️ My Wishlist</h1>

        {filteredWishlist.length === 0 ? (
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold dark:text-white">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mt-2">Save products you love here.</p>
            <button
              onClick={() => navigate("/customer")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishlist.map((item) => {
              const product = item.productId;
              return (
                <div
                  key={product._id}
                  className="relative bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col justify-between text-center transition duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(product._id);
                    }}
                    className="absolute top-3 right-3 z-20 text-2xl bg-black dark:bg-gray-800 rounded-full p-2 hover:scale-110 transition"
                  >
                    ❤️
                  </button>

                  {/* Image */}
                  <img
                    src={product.imageUrl}
                    alt={product.itemName}
                    className="h-40 w-full object-contain mb-4 rounded-md cursor-pointer transition duration-300 hover:opacity-90"
                  />

                  {/* Product Name */}
                  <Link
                    to={`/shop/${product._id}`}
                    className="font-semibold text-lg mb-2 text-gray-900 dark:text-white hover:text-blue-600"
                  >
                    {product.itemName}
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <p className="text-green-600 dark:text-green-400 font-bold mb-2">
                    ₹{product.price}
                  </p>

                  {/* Buttons */}
                  <div className="mt-auto w-full flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className="px-4 py-2 rounded w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Wishlist;
