// src/admin/Notifications.jsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [page, setPage] = useState(1);
  const resultsPerPage = 5;

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("http://localhost:5000/notifications", {
          credentials: "include",
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const modifyProductQuantity = async (productId) => {
    const newQuantity = prompt("Enter new quantity for this product:");
    if (!newQuantity) return;

    try {
      const res = await fetch(`http://localhost:5000/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ availableQuantity: Number(newQuantity) }),
      });

      if (res.ok) {
        alert("Product quantity updated!");
      } else {
        alert("Failed to update product.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(notifications.length / resultsPerPage);
  const paginatedNotifications = notifications.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Notifications</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <p className="dark:text-white">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {paginatedNotifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 border rounded shadow transition duration-200 
                hover:scale-[1.01] focus-within:shadow-lg 
                ${n.read ? "bg-gray-100 dark:bg-gray-700" : "bg-yellow-100 dark:bg-yellow-600"}`}
            >
              <p className="text-sm dark:text-white">{n.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {new Date(n.createdAt).toLocaleString()}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded transition transform hover:scale-105 focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </button>

                {n.productId && (
                  <button
                    onClick={() => modifyProductQuantity(n.productId)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm rounded transition transform hover:scale-105 focus:ring-2 focus:ring-green-400"
                  >
                    Modify Quantity
                  </button>
                )}

                <button
                  onClick={() =>
                    setExpandedNotification(
                      expandedNotification === n._id ? null : n._id
                    )
                  }
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded transition transform hover:scale-105 focus:ring-2 focus:ring-blue-400"
                >
                  {expandedNotification === n._id ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {expandedNotification === n._id && (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                  <p><strong>ID:</strong> {n._id}</p>
                  <p><strong>Status:</strong> {n.read ? "Read" : "Unread"}</p>
                  {n.productId && <p><strong>Product ID:</strong> {n.productId}</p>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default Notifications;
