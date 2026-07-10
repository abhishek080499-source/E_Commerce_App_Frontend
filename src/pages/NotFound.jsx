import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>

        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-bounce"
          style={{ animationDuration: "6s" }}
        ></div>

        <div
          className="absolute top-1/2 left-1/2 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl"
          style={{
            transform: "translate(-50%, -50%)",
            animation: "pulse 5s infinite",
          }}
        ></div>
      </div>

      {/* Card */}
      <div className="relative z-10 text-center backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-lg mx-5">

        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce">
          404
        </h1>

        {/* Emoji */}
        <div className="text-6xl mt-3 animate-pulse">😕</div>

        <h2 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white">
          Oops! Page Not Found
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          Looks like you've wandered into the unknown.
          <br />
          The page you're trying to visit doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">

          <Link
            to="/"
            className="group relative inline-flex items-center px-7 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-xl transition duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            <span className="relative z-10">🏠 Back Home</span>

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-0"></span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-7 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40 backdrop-blur-md font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 hover:scale-105"
          >
            ← Go Back
          </button>

        </div>
      </div>

      {/* Floating Icons */}
      <div
        className="absolute top-20 left-20 text-4xl opacity-30 animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        🌍
      </div>

      <div
        className="absolute bottom-20 left-32 text-3xl opacity-30 animate-pulse"
      >
        ⭐
      </div>

      <div
        className="absolute top-28 right-20 text-5xl opacity-30 animate-bounce"
        style={{ animationDuration: "5s" }}
      >
        🚀
      </div>

      <div
        className="absolute bottom-24 right-32 text-4xl opacity-30 animate-pulse"
      >
        💫
      </div>

    </div>
  );
}

export default NotFound;