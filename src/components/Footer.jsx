import React from "react";

function Footer() {
  return (
    <div className="w-full bg-gray-900 text-center border-t border-gray-700 py-2 fixed bottom-0 left-0 z-40 hover:bg-black transition duration-300">
      <div className="flex items-center justify-center gap-2">
        <img
          src="/favicon.png"
          alt="SwiftCart Logo"
          className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
        />

        <p className="text-sm sm:text-base text-white hover:text-yellow-400 transition duration-300">
          © 2026 SwiftCart. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;