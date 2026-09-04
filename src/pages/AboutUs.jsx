
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";

function AboutUs() {
  const navigate = useNavigate();

  // Redux cart state
  const cartItems = useSelector((state) => state.cart.items);

  // Local state for search bar
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ===============================
  // Logout
  // ===============================
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error(err);
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-indigo-950 dark:to-gray-950 text-white">

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse"></div>

        <div className="absolute top-10 right-[-80px] w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute bottom-[-100px] left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/20 transition duration-300">
            <span>🛍️</span>
            <span>Welcome to Our Store</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-500">
            About Us
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
            We believe in delivering quality products, creating amazing
            shopping experiences, and building long-lasting trust with
            every customer.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/customer")}
              className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Shopping
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-semibold backdrop-blur-sm hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16 md:py-20">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Text */}
          <div className="order-2 md:order-1">

            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              What Drives Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-5 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Our Mission
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              Our mission is to provide the best shopping experience by
              offering top-quality products, excellent customer service,
              and innovative solutions.
            </p>

            <p className="mt-4 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              We aim to make online shopping simple, secure, convenient,
              and enjoyable for everyone.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  ✓
                </div>

                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Quality Products
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  ✓
                </div>

                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Trusted Service
                </span>
              </div>

            </div>
          </div>

          {/* Mission Visual */}
          <div className="order-1 md:order-2 flex justify-center">

            <div className="relative group">

              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition duration-500"></div>

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 dark:from-blue-700 dark:to-indigo-950 shadow-2xl flex items-center justify-center transform group-hover:-rotate-3 group-hover:scale-105 transition-all duration-500">

                <div className="text-center">
                  <div className="text-7xl mb-4">🛍️</div>

                  <p className="text-xl font-bold">
                    Shop With Confidence
                  </p>

                  <p className="text-sm text-blue-100 mt-2">
                    Quality • Trust • Service
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      <section className="relative py-16 md:py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              What Matters To Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Our Core Values
            </h2>

            <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-400">
              Everything we do is guided by a simple set of principles
              that put our customers and quality first.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Value 1 */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">

              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition duration-300">
                ❤️
              </div>

              <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                Customer First
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Customer satisfaction is always our top priority.
              </p>

            </div>

            {/* Value 2 */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">

              <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition duration-300">
                🤝
              </div>

              <h3 className="text-lg font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                Integrity
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We believe in honest, transparent, and reliable business.
              </p>

            </div>

            {/* Value 3 */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">

              <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition duration-300">
                💡
              </div>

              <h3 className="text-lg font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                Innovation
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We continuously improve our platform and services.
              </p>

            </div>

            {/* Value 4 */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">

              <div className="w-14 h-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition duration-300">
                ⭐
              </div>

              <h3 className="text-lg font-bold mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition">
                Quality
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We are committed to delivering dependable and quality products.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= E-COMMERCE JOURNEY ================= */}
      <section className="max-w-6xl mx-auto w-full px-6 py-16 md:py-20">

        <div className="text-center mb-12">

          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Our Story
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Our E-Commerce Journey
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-gray-600 dark:text-gray-400 leading-relaxed">
            Founded with a vision to revolutionize online shopping, we
            bring together technology and trust. From fashion and
            electronics to home essentials and lifestyle products, our
            platform is designed to cater to diverse needs.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Wide Range */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

            <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl mb-5 group-hover:rotate-6 group-hover:scale-110 transition duration-300">
              🛒
            </div>

            <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
              Wide Range
            </h3>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Thousands of products across multiple categories to suit
              different lifestyles and needs.
            </p>

          </div>

          {/* Secure Shopping */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

            <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-5 group-hover:rotate-6 group-hover:scale-110 transition duration-300">
              🔒
            </div>

            <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
              Secure Shopping
            </h3>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Safe payments, protected transactions, and trusted delivery
              partners for a secure shopping experience.
            </p>

          </div>

          {/* Customer First */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl mb-5 group-hover:rotate-6 group-hover:scale-110 transition duration-300">
              👥
            </div>

            <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">
              Customer First
            </h3>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A dedicated support experience focused on customer
              satisfaction at every step.
            </p>

          </div>

        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 text-white py-16 md:py-20 overflow-hidden">

        {/* Decorative background */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-100">
              Get In Touch
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Contact Us
            </h2>

            <p className="max-w-2xl mx-auto mt-4 text-blue-100">
              Have a question or need assistance? Our team is always
              happy to help.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Email */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-500">

              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                📧
              </div>

              <h3 className="font-bold text-lg mb-2">
                Email
              </h3>

              <p className="text-blue-100 break-all">
                support@shopify.com
              </p>

            </div>

            {/* Phone */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-500">

              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                📞
              </div>

              <h3 className="font-bold text-lg mb-2">
                Phone
              </h3>

              <p className="text-blue-100">
                +91 8544709384
              </p>

            </div>

            {/* Address */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-500">

              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                📍
              </div>

              <h3 className="font-bold text-lg mb-2">
                Address
              </h3>

              <p className="text-blue-100">
                Chandigarh, India
              </p>

            </div>

          </div>

          <div className="text-center mt-10">

            <button
              onClick={() => navigate(-1)}
              className="px-7 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              ← Go Back
            </button>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default AboutUs;