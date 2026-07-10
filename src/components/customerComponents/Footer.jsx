import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10 mt-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Contact */}
        <div>
          <h4 className="font-bold mb-2 hover:text-yellow-400 transition duration-300">Contact</h4>
          <p>
            <strong>Address:</strong>{" "}
            <NavLink
              to="/work-in-progress"
              className="hover:text-blue-500 transition duration-300"
            >
              14/2 Dabhla, Gumarwin, Bilaspur, Himachal Pradesh, INDIA
            </NavLink>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <NavLink to="/work-in-progress" className="hover:text-green-500 transition duration-300">
              (+91) 9816320061
            </NavLink>,{" "}
            <NavLink to="/work-in-progress" className="hover:text-green-500 transition duration-300">
              (+91) 8544709384
            </NavLink>
          </p>
          <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
          <h4 className="font-bold mt-4">Follow us</h4>
          <div className="flex flex-wrap gap-3 mt-2">
            <NavLink to="/work-in-progress" className="hover:text-blue-600 transition duration-300">Facebook</NavLink>
            <NavLink to="/work-in-progress" className="hover:text-sky-400 transition duration-300">Twitter</NavLink>
            <NavLink to="/work-in-progress" className="hover:text-pink-400 transition duration-300">Instagram</NavLink>
            <NavLink to="/work-in-progress" className="hover:text-red-400 transition duration-300">Pinterest</NavLink>
            <NavLink to="/work-in-progress" className="hover:text-red-600 transition duration-300">YouTube</NavLink>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold mb-2 hover:text-yellow-400 transition duration-300">About</h4>
          <ul className="space-y-1">
            <li><NavLink to="/about-us" className="hover:text-blue-500 transition duration-300">About Us</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-blue-500 transition duration-300">Delivery Information</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-blue-500 transition duration-300">Privacy Policy</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-blue-500 transition duration-300">Terms & Conditions</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-blue-500 transition duration-300">Contact Us</NavLink></li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h4 className="font-bold mb-2 hover:text-yellow-400 transition duration-300">My Account</h4>
          <ul className="space-y-1">
            <li><NavLink to="/create-account" className="hover:text-green-500 transition duration-300">Sign In</NavLink></li>
            <li><NavLink to="/cart" className="hover:text-green-500 transition duration-300">View Cart</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-green-500 transition duration-300">My Wishlist</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-green-500 transition duration-300">Track My Order</NavLink></li>
            <li><NavLink to="/work-in-progress" className="hover:text-green-500 transition duration-300">Help</NavLink></li>
          </ul>
        </div>

        {/* Install App */}
        <div>
          <h4 className="font-bold mb-2 hover:text-yellow-400 transition duration-300">Install App</h4>
          <p>From App Store or Google Play</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <NavLink to="/work-in-progress" className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 cursor-pointer">App Store</NavLink>
            <NavLink to="/work-in-progress" className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 cursor-pointer">Google Play</NavLink>
          </div>
          <p className="mt-4">Secured Payment Gateways</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <NavLink
              to="/payment"
              className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 cursor-pointer text-gray-900 dark:text-white"
            >
              Payments
            </NavLink>
          </div>
        </div>
      </div>


      {/* Sticky bottom bar */}
      <div className="w-full bg-gray-900 text-center border-t border-gray-700 py-2 mt-8 fixed bottom-0 left-0 hover:bg-black transition duration-300">
        <p className="text-sm sm:text-base text-white hover:text-yellow-400 transition duration-300">
          © 2026 Shopify. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;


