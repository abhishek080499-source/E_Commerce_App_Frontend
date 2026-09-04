
// src/pages/WorkInProgress.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function WorkInProgress() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }


    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={0}
        wishlistCount={0}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= MAIN ================= */}
      <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-20 overflow-hidden">

        <div className="w-full max-w-2xl text-center">

          {/* Animated Icon */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-8">

            {/* Outer animated ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-pulse"></div>

            {/* Rotating ring */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-600 border-r-green-500 animate-spin"></div>

            {/* Icon container */}
            <div className="absolute inset-6 sm:inset-7 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center">

              <span className="text-5xl sm:text-6xl animate-bounce">
                🚧
              </span>

            </div>
          </div>

          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Coming Soon
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Work in Progress
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-7">
            We’re working hard to bring this page to you.
            <br className="hidden sm:block" />
            Please check back soon for something awesome!
          </p>

          {/* Animated Progress */}
          <div className="max-w-md mx-auto mt-8">

            <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              <span>Building...</span>
              <span>Coming Soon</span>
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              ← Go Back
            </button>

            <button
              onClick={() => navigate("/customer")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
               Home
            </button>

          </div>

          {/* Decorative Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-12">

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-2xl mb-1">⚙️</div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Building
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-2xl mb-1">💡</div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Improving
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Coming Soon
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default WorkInProgress;
