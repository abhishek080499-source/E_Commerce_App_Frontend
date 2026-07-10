import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../components/Header";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>

          <button
            onClick={closeSidebar}
            className="text-2xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="dashboard"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </Link>

          <Link
            to="add-product"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            Add Product
          </Link>
          <Link
            to="categories"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            Add Categories
          </Link>

          <Link
            to="products-details"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            Product Details
          </Link>

          <Link
            to="all-users"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            All Users
          </Link>

          <Link
            to="all-users-bills"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            All Users Bills
          </Link>
          <Link
            to="all-products"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            All Products
          </Link>
          <Link
            to="notifications"
            onClick={closeSidebar}
            className="block px-4 py-3 rounded-lg hover:bg-gray-700"
          >
            Notifications
          </Link>
        </nav>
      </aside>                          
        

      {/* Main */}
      <div className="flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;