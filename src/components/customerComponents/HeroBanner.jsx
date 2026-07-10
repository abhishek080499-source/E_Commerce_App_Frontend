import React from "react";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <section className="bg-blue-600 text-white text-center py-16">
      <h2 className="text-3xl font-bold">Big Sale is Live!</h2>
      <p className="mt-2">Shop the latest products at unbeatable prices.</p>
      <Link to="/shop" className="mt-4 inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg">
        Shop Now
      </Link>
    </section>
  );
}

export default HeroBanner;


