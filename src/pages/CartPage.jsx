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

  // ✅ Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty, please add items before checkout.");
      return;
    }

    navigate("/payment");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("customerInfo");
    localStorage.removeItem("theme");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
      <CustomerNavbar
        username={username}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Cart Content */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          🛍️ Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Your cart is empty. Start exploring our products and add something you love!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
                <tr>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {cart.map((item) => (
                  <tr
                    key={item._id || item.itemName}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-3 py-2 text-center">
                      {item.imageUrl ? (
                        <Link to={`/shop/${item._id}`}>
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="h-20 w-20 object-cover mx-auto rounded-md shadow-sm cursor-pointer hover:scale-105 transition"
                          />
                        </Link>
                      ) : (
                        <span className="text-gray-500">No image</span>
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <Link
                        to={`/shop/${item._id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition"
                      >
                        {item.itemName}
                      </Link>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description || "No description"}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                      ₹{item.price}
                    </td>
                    <td className="px-3 py-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item._id))}
                        className="bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                      >
                        -
                      </button>
                      <span className="px-2 text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item._id))}
                        disabled={item.quantity >= item.availableQuantity}
                        className={`px-2 py-1 rounded transition ${
                          item.quantity >= item.availableQuantity
                            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        +
                      </button>
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grand Total */}
        <div className="mt-6 text-right text-xl font-bold text-gray-900 dark:text-white">
          Grand Total: ₹{grandTotal}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => dispatch(clearCart())}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            🗑️ Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
          >
            ✅ Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CartPage;
