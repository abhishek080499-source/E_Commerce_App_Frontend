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

  // ✅ Always read from stored user object
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ✅ Fetch notifications count (admin only)
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
          credentials: "include",
        });
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
      <div className="flex items-center justify-between h-16 px-6">

        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white transition"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Welcome */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-gray-700 dark:text-white">
            Welcome, {username}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* ✅ Notification Bell (Admin only) */}
          <div className="relative cursor-pointer">
            <Link to="/admin/notifications">
              <span className="text-2xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white 
                                 text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>

          {/* Always show Admin */}
          <span className="font-semibold text-gray-700 dark:text-white">
            Admin
          </span>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              Profile
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border">
                <div className="px-4 py-3 border-b font-semibold dark:text-white">
                  {username}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
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
