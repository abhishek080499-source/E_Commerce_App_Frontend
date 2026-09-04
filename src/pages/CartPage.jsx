
// src/pages/CartPage.jsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ===============================
  // Checkout handler
  // ===============================
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty, please add items before checkout.");
      return;
    }

    navigate("/payment");
  };

  // ===============================
  // Logout
  // ===============================
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error(err);
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500">

      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={cart.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= CART CONTENT ================= */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}
          <div className="text-center mb-10">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-3xl mb-4 shadow-sm">
              🛍️
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Your Shopping Cart
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Review your items and continue to checkout
            </p>

          </div>

          {/* ================= EMPTY CART ================= */}
          {cart.length === 0 ? (

            <div className="max-w-2xl mx-auto">

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-10 sm:p-14 text-center">

                <div className="text-7xl mb-6">
                  🛒
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Your Cart is Empty
                </h2>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Your cart is waiting for something special.
                  Start exploring our products and add something
                  you love!
                </p>

                <button
                  onClick={() => navigate("/customer")}
                  className="mt-7 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Start Shopping
                </button>

              </div>

            </div>

          ) : (

            <div className="grid lg:grid-cols-3 gap-8 items-start">

              {/* ================= CART ITEMS ================= */}
              <div className="lg:col-span-2">

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">

                  {/* Cart header */}
                  <div className="px-5 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Cart Items
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                      </p>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                      {cart.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      Total Qty
                    </div>

                  </div>

                  {/* ================= DESKTOP TABLE ================= */}
                  <div className="hidden md:block overflow-x-auto">

                    <table className="w-full border-collapse">

                      <thead className="bg-gray-50 dark:bg-gray-900/70">

                        <tr className="text-left">

                          <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Product
                          </th>

                          <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Price
                          </th>

                          <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                            Quantity
                          </th>

                          <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Total
                          </th>

                          <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                            Action
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {cart.map((item) => (

                          <tr
                            key={item._id || item.itemName}
                            className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition duration-300"
                          >

                            {/* Product */}
                            <td className="px-5 py-5">

                              <div className="flex items-center gap-4 min-w-[260px]">

                                {item.imageUrl ? (

                                  <Link
                                    to={`/shop/${item._id}`}
                                    className="shrink-0"
                                  >
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-sm">

                                      <img
                                        src={item.imageUrl}
                                        alt={item.itemName}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                      />

                                    </div>
                                  </Link>

                                ) : (

                                  <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                                    No image
                                  </div>

                                )}

                                <div className="min-w-0">

                                  <Link
                                    to={`/shop/${item._id}`}
                                    className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1"
                                  >
                                    {item.itemName}
                                  </Link>

                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {item.description || "No description"}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Price */}
                            <td className="px-4 py-5 whitespace-nowrap">

                              <span className="font-semibold text-gray-900 dark:text-white">
                                ₹{item.price}
                              </span>

                            </td>

                            {/* Quantity */}
                            <td className="px-4 py-5">

                              <div className="flex items-center justify-center">

                                <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700">

                                  <button
                                    onClick={() =>
                                      dispatch(
                                        decreaseQuantity(item._id)
                                      )
                                    }
                                    className="w-9 h-9 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                  >
                                    −
                                  </button>

                                  <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      dispatch(
                                        increaseQuantity(item._id)
                                      )
                                    }
                                    disabled={
                                      item.quantity >=
                                      item.availableQuantity
                                    }
                                    className={`w-9 h-9 flex items-center justify-center text-lg font-semibold transition ${
                                      item.quantity >=
                                      item.availableQuantity
                                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                        : "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                    }`}
                                  >
                                    +
                                  </button>

                                </div>

                              </div>

                            </td>

                            {/* Total */}
                            <td className="px-4 py-5 whitespace-nowrap">

                              <span className="font-bold text-gray-900 dark:text-white">
                                ₹{item.price * item.quantity}
                              </span>

                            </td>

                            {/* Action */}
                            <td className="px-4 py-5 text-center">

                              <button
                                onClick={() =>
                                  dispatch(
                                    removeFromCart(item._id)
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-red-500 hover:text-white border border-red-200 dark:border-red-900/50 hover:bg-red-500 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                              >
                                🗑️
                                <span>Remove</span>
                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* ================= MOBILE CART ================= */}
                  <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">

                    {cart.map((item) => (

                      <div
                        key={item._id || item.itemName}
                        className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition duration-300"
                      >

                        <div className="flex gap-4">

                          {/* Image */}
                          {item.imageUrl ? (

                            <Link
                              to={`/shop/${item._id}`}
                              className="shrink-0"
                            >
                              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">

                                <img
                                  src={item.imageUrl}
                                  alt={item.itemName}
                                  className="w-full h-full object-cover"
                                />

                              </div>
                            </Link>

                          ) : (

                            <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>

                          )}

                          {/* Details */}
                          <div className="flex-1 min-w-0">

                            <Link
                              to={`/shop/${item._id}`}
                              className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2"
                            >
                              {item.itemName}
                            </Link>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {item.description || "No description"}
                            </p>

                            <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                              ₹{item.price}
                            </p>

                          </div>

                        </div>

                        {/* Mobile controls */}
                        <div className="mt-5 flex items-center justify-between gap-4">

                          <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-700">

                            <button
                              onClick={() =>
                                dispatch(
                                  decreaseQuantity(item._id)
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                              −
                            </button>

                            <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                dispatch(
                                  increaseQuantity(item._id)
                                )
                              }
                              disabled={
                                item.quantity >=
                                item.availableQuantity
                              }
                              className={`w-9 h-9 flex items-center justify-center text-lg font-semibold transition ${
                                item.quantity >=
                                item.availableQuantity
                                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                  : "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                              }`}
                            >
                              +
                            </button>

                          </div>

                          <div className="text-right">

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Item Total
                            </p>

                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{item.price * item.quantity}
                            </p>

                          </div>

                        </div>

                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item._id))
                          }
                          className="w-full mt-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white font-medium transition-all duration-300"
                        >
                          🗑️ Remove Item
                        </button>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

              {/* ================= ORDER SUMMARY ================= */}
              <div className="lg:sticky lg:top-24">

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">

                  {/* Summary Header */}
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Order Summary
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Review your total before checkout
                    </p>

                  </div>

                  <div className="p-6">

                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">

                      <span>
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{grandTotal}
                      </span>

                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between mt-4 text-gray-600 dark:text-gray-400">

                      <span>
                        Delivery
                      </span>

                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        FREE
                      </span>

                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-5"></div>

                    {/* Grand total */}
                    <div className="flex items-center justify-between">

                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Grand Total
                      </span>

                      <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                        ₹{grandTotal}
                      </span>

                    </div>

                    {/* Checkout */}
                    <button
                      onClick={handleCheckout}
                      className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      ✅ Proceed to Checkout
                    </button>

                    {/* Clear cart */}
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="w-full mt-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      🗑️ Clear Cart
                    </button>

                    {/* Trust message */}
                    <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">

                      <div className="flex items-start gap-3">

                        <div className="text-xl">
                          🔒
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Secure Checkout
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Your shopping information is protected
                            during checkout.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default CartPage;
