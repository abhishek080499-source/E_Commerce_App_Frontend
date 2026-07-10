import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "../Pagination"; 

function ProductList({ products, loading, addToCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // ✅ Reset page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 py-6">
      {/* Heading with background color responsive to theme */}
      <h2 className="text-2xl font-bold mb-6 text-center 
                     bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white 
                     hover:text-blue-600 dark:hover:text-yellow-400 
                     transition duration-300 py-2 rounded">
        Featured Products
      </h2>

      {loading ? (
        <div className="text-center text-lg text-gray-600 dark:text-white animate-pulse">
          Loading Products...
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </>
      ) : (
        <p className="text-center text-gray-500 italic dark:text-white">
          No products found.
        </p>
      )}
    </main>
  );
}

export default ProductList;
