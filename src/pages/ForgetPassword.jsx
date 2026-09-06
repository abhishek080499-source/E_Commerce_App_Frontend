
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Apply saved theme when Forgot Password page loads
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(
          typeof data.message === "string"
            ? data.message
            : "Password reset link has been sent."
        );
      } else {
        // Handle error when backend returns an object
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error?.message ||
              (typeof data.message === "string"
                ? data.message
                : "Unable to send password reset email.");

        setError(errorMessage);

        // Return to login after showing the error
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);

      setError("Something went wrong. Please try again.");

      // Return to login if request completely fails
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md">
        

{/* =========================
    BRAND
========================== */}
<div className="flex justify-center mb-6">
{/* SwiftCart Logo + Name */}
<div
  className="
    inline-flex
    items-center
    gap-2.5
    cursor-pointer
    group
    select-none
  "
>
  {/* Logo */}
  <div
    className="
      relative
      w-9 h-9
      sm:w-10 sm:h-10
      flex-shrink-0
      rounded-xl
      flex
      items-center
      justify-center
      bg-white
      dark:bg-gray-800
      border
      border-gray-200
      dark:border-gray-700
      shadow-sm
      group-hover:shadow-md
      group-hover:border-blue-200
      dark:group-hover:border-blue-500/40
      group-hover:scale-105
      transition-all
      duration-300
      overflow-hidden
    "
  >
    <img
      src="/favicon.png"
      alt="SwiftCart Logo"
      className="
        w-[78%]
        h-[78%]
        object-contain
        transition-transform
        duration-300
        group-hover:scale-110
      "
    />

    {/* Small glow */}
    <div
      className="
        absolute
        inset-0
        rounded-xl
        bg-blue-500/0
        group-hover:bg-blue-500/5
        transition-colors
        duration-300
      "
    />
  </div>

  {/* Brand Name */}
  <div className="whitespace-nowrap text-left leading-none">
    <h2
      className="
        text-lg
        sm:text-xl
        font-extrabold
        tracking-tight
        text-gray-800
        dark:text-white
        group-hover:text-blue-600
        dark:group-hover:text-blue-400
        transition-colors
        duration-300
      "
    >
      SwiftCart
    </h2>

    <p
      className="
        mt-1
        text-[8px]
        sm:text-[9px]
        font-semibold
        tracking-[0.14em]
        text-gray-500
        dark:text-gray-400
        uppercase
        transition-colors
        duration-300
        group-hover:text-gray-600
        dark:group-hover:text-gray-300
      "
    >
      Shop Smart • Shop Fast
    </p>
  </div>
</div>
</div>




        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
              <span className="text-2xl">🔑</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your email and we'll send you a password reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Success Message */}
          {message && (
            <div className="mt-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>

              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                Returning to login...
              </p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-7 pt-5 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              <span>←</span>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-500">
          If you don't receive an email, please check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
