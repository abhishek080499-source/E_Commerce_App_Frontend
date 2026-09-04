
// src/pages/Login.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Apply saved theme when Login page loads
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        /*
         * Load cart belonging to this user.
         *
         * Example:
         *
         * User A -> cart_123
         * User B -> cart_456
         */
        let savedCart = [];

        try {
          const storedCart = localStorage.getItem(
            `cart_${data.user._id}`
          );

          if (storedCart) {
            const parsedCart = JSON.parse(
              storedCart
            );

            if (Array.isArray(parsedCart)) {
              savedCart = parsedCart;
            }
          }
        } catch (error) {
          console.error(
            "Unable to load saved cart:",
            error
          );

          savedCart = [];
        }

        // Put user's cart into Redux
        dispatch(setCart(savedCart));

        // Navigate according to user type
        if (data.user.type === "admin") {
          navigate("/admin");
        } else if (data.user.type === "customer") {
          navigate("/customer");
        } else {
          navigate("/login");
        }
      } else {
        alert(
          `${data.error || "Login failed"}\nPlease enter valid details.`
        );
      }
    } catch (err) {
      console.error(err);

      alert("Backend not reachable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-yellow-400">
            Shopify
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Welcome bacK
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>

          <p className="mt-1 mb-7 text-sm text-gray-500 dark:text-gray-400">
            Enter your details to access your account.
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Create Account */}
          <div className="mt-7 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/create-account"
                className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
