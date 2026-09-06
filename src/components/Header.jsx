
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);

  // Always read from stored user object
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  // ===============================
  // Logout
  // ===============================
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    navigate("/login");
  };

  // ===============================
  // Close profile when clicking outside
  // ===============================
  useEffect(() => {
    function handleClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // ===============================
  // Dark Mode
  // ===============================
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ===============================
  // Fetch Notifications
  // ===============================
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/notifications`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        const unread = data.filter((n) => !n.read).length;

        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow">

      <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-3">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-3 min-w-0">

          {/* Hamburger Button */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white transition flex-shrink-0"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* ================= SWIFTCART BRAND ================= */}
          <div
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 cursor-pointer min-w-0 group flex-shrink-0"
          >

            {/* Logo */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">

              <img
                src="/favicon.png"
                alt="SwiftCart Logo"
                className="w-full h-full object-contain"
              />

            </div>

            {/* Brand Name */}
            <div className="hidden sm:block whitespace-nowrap">

              <h2 className="text-lg font-extrabold tracking-tight text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                SwiftCart
              </h2>

              <p className="text-[9px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase leading-none">
                Shop Smart • Shop Fast
              </p>

            </div>

          </div>

        </div>

        {/* ================= WELCOME ================= */}
        <div className="flex-1 text-center min-w-0">

          <h1 className="text-base sm:text-lg font-bold text-gray-700 dark:text-white truncate">
            Welcome, {username}
          </h1>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Notification Bell */}
          <div className="relative cursor-pointer">

            <Link
              to="/admin/notifications"
              aria-label="Notifications"
              className="block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >

              <span className="text-2xl">
                🔔
              </span>

              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[10px] font-bold px-1 rounded-full"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}

            </Link>

          </div>

          {/* Admin */}
          <span className="hidden md:block font-semibold text-gray-700 dark:text-white whitespace-nowrap">
            Admin
          </span>

          {/* Dark Mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            className="px-2 sm:px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform duration-300 hover:scale-105"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>

          {/* ================= PROFILE ================= */}
          <div
            className="relative"
            ref={profileRef}
          >

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-2 sm:px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              <span className="hidden sm:inline">
                Profile
              </span>

              <span className="sm:hidden">
                👤
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">

                {/* User */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold dark:text-white truncate">
                  {username}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}

export default Header;
