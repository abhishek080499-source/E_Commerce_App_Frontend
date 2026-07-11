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

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error(err);
    }
      localStorage.clear();
      localStorage.removeItem("user");
      localStorage.removeItem("theme");
    navigate("/login");
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16 text-center transition duration-300">
        <h1 className="text-4xl md:text-5xl font-bold hover:scale-105 transform transition duration-300">
          About Us
        </h1>
        <p className="mt-4 text-lg md:text-xl hover:text-yellow-300 transition duration-300">
          We believe in delivering quality products and building trust with our customers.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white hover:text-blue-600 transition duration-300">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
          Our mission is to provide the best shopping experience by offering top-quality products,
          excellent customer service, and innovative solutions. We aim to make online shopping
          simple, secure, and enjoyable for everyone.
        </p>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-6xl mx-auto py-12 px-6 my-8 hover:shadow-xl transition duration-300">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white hover:text-blue-600 transition duration-300">
          Our Values
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li className="hover:text-green-600 transition duration-300">Customer Satisfaction is our priority</li>
          <li className="hover:text-green-600 transition duration-300">Integrity and transparency in business</li>
          <li className="hover:text-green-600 transition duration-300">Innovation and continuous improvement</li>
          <li className="hover:text-green-600 transition duration-300">Commitment to quality and reliability</li>
        </ul>
      </section>

      {/* E-commerce Story Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white hover:text-blue-600 transition duration-300">
          Our E‑Commerce Journey
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Founded with a vision to revolutionize online shopping, we bring together technology and trust. 
          From fashion to electronics, home essentials to lifestyle products, our platform is designed to 
          cater to diverse needs. We partner with reliable brands and local sellers to ensure authenticity 
          and variety.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-yellow-400">Wide Range</h3>
            <p className="text-gray-600 dark:text-gray-300">Thousands of products across categories to suit every lifestyle.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-yellow-400">Secure Shopping</h3>
            <p className="text-gray-600 dark:text-gray-300">Safe payments, encrypted transactions, and trusted delivery partners.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-yellow-400">Customer First</h3>
            <p className="text-gray-600 dark:text-gray-300">Dedicated support team ensuring satisfaction at every step.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto py-12 px-6 flex-grow">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white hover:text-blue-600 transition duration-300">
          Contact Us
        </h2>
        <p className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
          📧 Email: <span className="hover:text-red-500">support@shopify.com</span> <br />
          📞 Phone: <span className="hover:text-red-500">+91 8544709384</span> <br />
          📍 Address: <span className="hover:text-red-500">Chandigarh, India</span>
        </p>
        <br />
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
        >
          Go Back
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;
