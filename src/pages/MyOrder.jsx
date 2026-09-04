
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function MyOrders() {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username =
    user?.username || localStorage.getItem("username") || "Customer";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/payment/my-orders`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.bills);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    navigate("/login");
  };

  const filteredOrders = orders.filter((bill) => {
    const query = searchQuery.toLowerCase();

    return (
      bill.billNumber?.toLowerCase().includes(query) ||
      bill.customerName?.toLowerCase().includes(query) ||
      bill.items?.some((item) =>
        item.productName?.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto w-full flex-1 p-6">

        {loading ? (
          /* ================= LOADING ================= */
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">

              {/* Spinner */}
              <div className="relative flex items-center justify-center">

                {/* Outer pulse */}
                <div className="absolute w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-ping opacity-50"></div>

                {/* Rotating spinner */}
                <div className="w-14 h-14 border-4 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>

                {/* Center dot */}
                <div className="absolute w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
              </div>

              {/* Loading text */}
              <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
                Loading your orders...
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please wait a moment
              </p>
            </div>
          </div>
        ) : (
          /* ================= ORDERS ================= */
          <>
            <h1 className="text-3xl font-bold mb-8 dark:text-white">
              My Orders
            </h1>

            {filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold dark:text-white">
                  No Orders Found
                </h2>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((bill) => (
                  <div
                    key={bill._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                      <div>
                        <h2 className="text-lg font-bold dark:text-white">
                          {bill.billNumber}
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                          {new Date(bill.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-white font-semibold w-fit ${
                          bill.status === "Pending"
                            ? "bg-yellow-500"
                            : bill.status === "Processing"
                            ? "bg-blue-600"
                            : "bg-green-600"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>

                    <hr className="my-5 dark:border-gray-700" />

                    <div className="space-y-3">
                      {bill.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between border-b pb-2 dark:border-gray-700 dark:text-white"
                        >
                          <div className="font-medium">
                            {item.productName}
                          </div>

                          <div>
                            Qty : <strong>{item.quantity}</strong>
                          </div>

                          <div>₹{item.total}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-5 text-lg font-bold dark:text-white">
                      <span>Grand Total</span>
                      <span>₹{bill.grandTotal}</span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_API_URL}/payment/invoice/${bill.billNumber}`,
                            "_blank"
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default MyOrders;