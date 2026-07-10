import React from "react";

function WorkInProgress() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🚧 Work in Progress 🚧</h1>
      <p className="text-lg text-gray-600 mb-6">
        This page is currently under construction. Please check back later!
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
}

export default WorkInProgress;
