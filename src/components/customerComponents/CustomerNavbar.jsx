
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function CustomerNavbar({
  username,
  cartCount,
  onLogout,
  searchQuery,
  setSearchQuery,
}) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const baseClasses =
    "font-medium text-gray-900 dark:text-white hover:text-yellow-400 transition duration-300";

  const activeClasses =
    "text-yellow-400 underline font-semibold";

  // -------------------------
  // Dark Mode
  // -------------------------
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // -------------------------
  // Close menu on route change
  // -------------------------
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // -------------------------
  // Close menu when switching
  // from Mobile -> Desktop
  // -------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // -------------------------
  // Close on outside click
  // -------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // -------------------------
  // ESC key closes menu
  // -------------------------
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKey
      );
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="text-yellow-400">
            Shopify
          </span>

          <span className="hidden sm:inline dark:text-white">
            {" "}
            | Welcome, {username}
          </span>
        </h1>

        {/* Hamburger */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400  dark:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">

          <NavLink
            to="/customer"
            className={({ isActive }) =>
              isActive
                ? activeClasses
                : baseClasses
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? activeClasses
                : baseClasses
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/my-orders"
            className={({ isActive }) =>
              isActive
                ? activeClasses
                : baseClasses
            }
          >
            My Orders
          </NavLink>

          <NavLink
            to="/about-us"
            className={({ isActive }) =>
              isActive
                ? activeClasses
                : baseClasses
            }
          >
            About Us
          </NavLink>

          {/* Search */}
          <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="px-3 py-2 w-52 bg-white dark:bg-gray-800 dark:text-white outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4">
              Search
            </button>
          </div>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition hover:scale-105"
          >
             Cart

            <span className="bg-white text-green-700 px-2 rounded-full font-bold">
              {cartCount}
            </span>
          </NavLink>

          {/* Theme */}
          <button
            onClick={() =>
              setIsDarkMode(!isDarkMode)
            }
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition hover:scale-105"
          >
            Logout
          </button>

        </div>
      </div>
            {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`lg:hidden absolute left-0 top-full w-full bg-white dark:bg-gray-900 shadow-xl border-t dark:text-white dark:border-gray-700 z-50 transform transition-all duration-300 origin-top ${
          isOpen
            ? "scale-y-100 opacity-100 visible"
            : "scale-y-0 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-5 space-y-4">
          {/* Home */}
          <NavLink
            to="/customer"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${isActive ? activeClasses : baseClasses} block`
            }
          >
             Home
          </NavLink>

          {/* Shop */}
          <NavLink
            to="/shop"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${isActive ? activeClasses : baseClasses} block`
            }
          >
             Shop
          </NavLink>
          <NavLink
            to="/my-orders"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${isActive ? activeClasses : baseClasses} block`
            }
          >
             My Orders
          </NavLink>

          {/* About */}
          <NavLink
            to="/about-us"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${isActive ? activeClasses : baseClasses} block`
            }
          >
             About Us
          </NavLink>

          {/* Search */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-l-lg bg-white dark:bg-gray-800 dark:text-white outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg">
              Search
            </button>
          </div>

          {/* Cart */}
{/* Cart + Theme + Logout */}
<div className="flex items-center justify-center gap-3 pt-2">

  {/* Cart */}
  <NavLink
    to="/cart"
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
  >
    <span>Cart</span>
    <span>{cartCount}</span>
  </NavLink>

  {/* Dark Mode */}
  <button
    onClick={() => setIsDarkMode(!isDarkMode)}
    className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
  >
    {isDarkMode ? "🌙" : "☀️"}
  </button>

  {/* Logout */}
  <button
    onClick={() => {
      setIsOpen(false);
      onLogout();
    }}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
  >
    Logout
  </button>

</div>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;