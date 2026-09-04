
import React from "react";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-blue-600 dark:bg-gray-900
        text-white text-center
        px-5 sm:px-8
        py-14 sm:py-16 md:py-20
        transition-colors duration-500
      "
    >
      {/* Decorative circles */}
      <div
        className="
          absolute -top-20 -left-20
          w-48 h-48
          rounded-full
          bg-white/10
          animate-pulse
        "
      />

      <div
        className="
          absolute -bottom-24 -right-16
          w-64 h-64
          rounded-full
          bg-blue-400/20
        "
      />

      {/* Subtle shine effect */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-transparent via-white/10 to-transparent
          -translate-x-full
          animate-[shine_4s_ease-in-out_infinite]
        "
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Small heading */}
        <p
          className="
            text-yellow-300
            text-sm sm:text-base
            font-semibold
            uppercase
            tracking-[0.2em]
            mb-3
            animate-[fadeIn_0.8s_ease-out]
          "
        >
          Special Offer
        </p>

        {/* Main heading */}
        <h2
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-bold
            tracking-tight
            animate-[fadeInUp_0.8s_ease-out]
          "
        >
          Big Sale is Live!
        </h2>

        {/* Description */}
        <p
          className="
            mt-3
            text-sm
            sm:text-base
            md:text-lg
            text-blue-100
            dark:text-gray-300
            max-w-xl
            mx-auto
            leading-relaxed
            animate-[fadeInUp_1s_ease-out]
          "
        >
          Shop the latest products at unbeatable prices.
        </p>

        {/* Button */}
        <Link
          to="/shop"
          className="
            mt-6
            inline-block
            bg-yellow-400
            hover:bg-yellow-300
            text-gray-900
            font-semibold
            px-7 sm:px-8
            py-3
            rounded-lg
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            active:translate-y-0
            transition-all
            duration-300
          "
        >
          Shop Now
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Bottom decorative line */}
      <div
        className="
          absolute bottom-0 left-1/2
          -translate-x-1/2
          w-24 sm:w-32
          h-1
          bg-yellow-400
          rounded-full
        "
      />
    </section>
  );
}

export default HeroBanner;
