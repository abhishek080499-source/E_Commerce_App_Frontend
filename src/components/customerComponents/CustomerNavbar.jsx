import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function CustomerNavbar({
  username,
  cartCount,
  onLogout,
  searchQuery,
  setSearchQuery,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const mobileUsername =
    username && username.length > 15
      ? `${username.slice(0, 15)}...`
      : username;

  const desktopUsername =
    username && username.length > 18
      ? `${username.slice(0, 15)}...`
      : username;

  // Classic navigation link
  const baseClasses =
    "relative font-medium text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-300 py-2";

  const activeClasses =
    "relative font-semibold text-yellow-500 dark:text-yellow-400 py-2";

  // -------------------------
  // Search
  // -------------------------
  const handleSearch = () => {
    const search = searchQuery.trim();

    if (search) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    } else {
      navigate("/shop");
    }

    setIsOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // -------------------------
// Logout
// -------------------------
const handleLogout = async () => {
  if (isLoggingOut) return;

  setIsLoggingOut(true);
  setIsOpen(false);

  try {
    await onLogout();
  } catch (error) {
    console.error("Logout failed:", error);
    setIsLoggingOut(false);
  }
};

  // -------------------------
  // Search Input Change
  // -------------------------
  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    // If user clears the search while already on Shop,
    // immediately remove the search query and show all products.
    if (!value.trim() && location.pathname === "/shop") {
      navigate("/shop");
    }
  };

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
      document.removeEventListener("mousedown", handleClickOutside);
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

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-white dark:bg-gray-950
        border-b border-gray-200 dark:border-gray-800
        shadow-md
        transition-all duration-300
      "
    >
      {/* =========================
          NAVBAR TOP
      ========================== */}
      <div
        className="
          w-full
          px-2 sm:px-6 lg:px-8
          py-2 sm:py-3
          flex items-center justify-between
          min-h-[60px] sm:min-h-[68px]
          gap-1 sm:gap-3
        "
      >
        {/* =========================
            LEFT SIDE
        ========================== */}
        <div
          className="
            flex items-center
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          {/* =========================
              LOGO + BRAND
          ========================== */}
          <div
            onClick={() => navigate("/customer")}
            className="
              flex items-center
              gap-1.5 sm:gap-2
              cursor-pointer
              flex-shrink-0
              group
            "
          >
            {/* Logo */}
            <div
              className="
                w-8 h-8
                sm:w-10 sm:h-10
                flex-shrink-0
                rounded-lg
                flex items-center justify-center
                group-hover:scale-105
                transition-transform duration-300
              "
            >
              <img
                src="/favicon.png"
                alt="SwiftCart Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand Name */}
            <div className="whitespace-nowrap">
              <h2
                className="
                  text-base sm:text-xl
                  font-extrabold
                  tracking-tight
                  text-gray-800
                  dark:text-white
                  group-hover:text-blue-600
                  dark:group-hover:text-blue-400
                  transition-colors duration-300
                "
              >
                SwiftCart
              </h2>

              <p
                className="
                  text-[7px] sm:text-[9px]
                  font-semibold
                  tracking-wider
                  text-gray-500
                  dark:text-gray-400
                  uppercase
                  leading-none
                "
              >
                Shop Smart • Shop Fast
              </p>
            </div>
          </div>

          {/* =========================
              MOBILE WELCOME
          ========================== */}
          <span
            className="
              inline sm:hidden
              text-gray-700
              dark:text-gray-200
              font-medium
              text-xs
              ml-2
              truncate
              min-w-0
            "
          >
            Welcome, {mobileUsername}
          </span>

          {/* =========================
              DESKTOP WELCOME
          ========================== */}
          <span
            className="
              hidden sm:inline
              text-gray-700
              dark:text-gray-200
              font-medium
              ml-4
              whitespace-nowrap
            "
          >
            Welcome, {desktopUsername}
          </span>
        </div>

        {/* =========================
            HAMBURGER
        ========================== */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="
            lg:hidden
            flex-shrink-0
            p-2
            rounded-lg
            text-gray-700
            dark:text-gray-200
            hover:bg-gray-100
            dark:hover:bg-gray-800
            hover:text-yellow-500
            transition-all duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
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

        {/* =========================
            DESKTOP MENU
        ========================== */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6">
          {/* Home */}
          <NavLink
            to="/customer"
            className={({ isActive }) =>
              isActive ? activeClasses : baseClasses
            }
          >
            Home
          </NavLink>

          {/* Shop */}
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? activeClasses : baseClasses
            }
          >
            Shop
          </NavLink>

          {/* My Orders */}
          <NavLink
            to="/my-orders"
            className={({ isActive }) =>
              isActive ? activeClasses : baseClasses
            }
          >
            My Orders
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? activeClasses : baseClasses
            }
          >
            Wishlist
          </NavLink>

          {/* About Us */}
          <NavLink
            to="/about-us"
            className={({ isActive }) =>
              isActive ? activeClasses : baseClasses
            }
          >
            About Us
          </NavLink>

          {/* Search */}
          <div
            className="
              flex
              overflow-hidden
              rounded-lg
              border border-gray-300
              dark:border-gray-700
              bg-white dark:bg-gray-900
              shadow-sm
              focus-within:ring-2
              focus-within:ring-yellow-400
              transition-all duration-300
            "
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="
                px-3 py-2
                w-44 xl:w-52
                bg-transparent
                text-gray-800
                dark:text-white
                placeholder-gray-400
                outline-none
                text-sm
              "
            />

            <button
              onClick={handleSearch}
              className="
                bg-gray-900
                hover:bg-yellow-500
                dark:bg-yellow-500
                dark:hover:bg-yellow-400
                text-white
                dark:text-gray-900
                px-4
                font-medium
                transition-all duration-300
              "
            >
              Search
            </button>
          </div>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="
              flex items-center gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              px-4 py-2
              rounded-lg
              font-medium
              shadow-sm
              hover:shadow-md
              hover:-translate-y-0.5
              transition-all duration-300
            "
          >
            <span>Cart</span>

            <span
              className="
                min-w-[22px]
                h-[22px]
                px-1.5
                flex items-center justify-center
                bg-white
                text-green-700
                rounded-full
                text-xs
                font-bold
              "
            >
              {cartCount}
            </span>
          </NavLink>

          {/* Theme */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-lg
              bg-gray-100
              dark:bg-gray-800
              text-gray-700
              dark:text-yellow-400
              border border-gray-200
              dark:border-gray-700
              hover:bg-yellow-100
              dark:hover:bg-gray-700
              hover:scale-105
              transition-all duration-300
            "
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>

          {/* Logout */}
        <button
  onClick={handleLogout}
  disabled={isLoggingOut}
  className={`
    bg-red-600
    text-white
    px-4 py-2
    rounded-lg
    font-medium
    shadow-sm
    transition-all duration-300
    ${
      isLoggingOut
        ? "opacity-60 cursor-not-allowed"
        : "hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5"
    }
  `}
>
  {isLoggingOut ? "Logging out..." : "Logout"}
</button>
        </div>
      </div>

      {/* =========================
          MOBILE OVERLAY
      ========================== */}
      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-black/40
            backdrop-blur-[2px]
            z-40
            lg:hidden
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =========================
          MOBILE MENU
      ========================== */}
      <div
        ref={menuRef}
        className={`
          lg:hidden
          absolute left-0 top-full
          w-full
          bg-white dark:bg-gray-950
          border-t border-gray-200
          dark:border-gray-800
          shadow-xl
          z-50
          origin-top
          transition-all duration-300 ease-out
          ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-3 invisible"
          }
        `}
      >
        <div className="p-4 sm:p-5 space-y-2">
          {/* Home */}
          <NavLink
            to="/customer"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              ${isActive ? activeClasses : baseClasses}
              block
              px-3 py-2.5
              rounded-lg
              hover:bg-gray-50
              dark:hover:bg-gray-900
            `}
          >
            Home
          </NavLink>

          {/* Shop */}
          <NavLink
            to="/shop"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              ${isActive ? activeClasses : baseClasses}
              block
              px-3 py-2.5
              rounded-lg
              hover:bg-gray-50
              dark:hover:bg-gray-900
            `}
          >
            Shop
          </NavLink>

          {/* My Orders */}
          <NavLink
            to="/my-orders"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              ${isActive ? activeClasses : baseClasses}
              block
              px-3 py-2.5
              rounded-lg
              hover:bg-gray-50
              dark:hover:bg-gray-900
            `}
          >
            My Orders
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              ${isActive ? activeClasses : baseClasses}
              block
              px-3 py-2.5
              rounded-lg
              hover:bg-gray-50
              dark:hover:bg-gray-900
            `}
          >
            Wishlist
          </NavLink>

          {/* About Us */}
          <NavLink
            to="/about-us"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              ${isActive ? activeClasses : baseClasses}
              block
              px-3 py-2.5
              rounded-lg
              hover:bg-gray-50
              dark:hover:bg-gray-900
            `}
          >
            About Us
          </NavLink>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-800 my-3" />

          {/* Search */}
          <div
            className="
              flex
              w-full
              overflow-hidden
              rounded-lg
              border border-gray-300
              dark:border-gray-700
              bg-white dark:bg-gray-900
              focus-within:ring-2
              focus-within:ring-yellow-400
              transition-all duration-300
            "
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="
                flex-1
                min-w-0
                px-3 sm:px-4
                py-2.5
                bg-transparent
                text-gray-800
                dark:text-white
                placeholder-gray-400
                outline-none
                text-sm
              "
            />

            <button
              onClick={handleSearch}
              className="
                flex-shrink-0
                bg-gray-900
                hover:bg-yellow-500
                dark:bg-yellow-500
                dark:hover:bg-yellow-400
                text-white
                dark:text-gray-900
                px-3 sm:px-4
                font-medium
                transition-all duration-300
              "
            >
              Search
            </button>
          </div>

          {/* Cart + Theme + Logout */}
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2 sm:gap-3
              pt-4
            "
          >
            {/* Cart */}
            <NavLink
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-2
                bg-green-600
                hover:bg-green-700
                text-white
                px-3 sm:px-4
                py-2.5
                rounded-lg
                text-sm
                font-medium
                shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
              "
            >
              <span>Cart</span>

              <span
                className="
                  min-w-[20px]
                  h-[20px]
                  px-1
                  flex items-center justify-center
                  bg-white
                  text-green-700
                  rounded-full
                  text-xs
                  font-bold
                "
              >
                {cartCount}
              </span>
            </NavLink>

            {/* Dark Mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle dark mode"
              className="
                w-11 h-11
                flex items-center justify-center
                rounded-lg
                bg-gray-100
                dark:bg-gray-800
                border border-gray-200
                dark:border-gray-700
                hover:bg-yellow-100
                dark:hover:bg-gray-700
                hover:scale-105
                transition-all duration-300
              "
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>

            {/* Logout */}
<button
  onClick={handleLogout}
  disabled={isLoggingOut}
  className={`
    text-white
    px-3 sm:px-4
    py-2.5
    rounded-lg
    text-sm
    font-medium
    shadow-sm
    transition-all duration-300
    ${
      isLoggingOut
        ? "bg-red-600 opacity-60 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700 hover:-translate-y-0.5"
    }
  `}
>
  {isLoggingOut ? "Logging out..." : "Logout"}
</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;