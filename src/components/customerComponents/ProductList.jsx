
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "../Pagination";

function ProductList({
  products,
  loading,
  addToCart,
  wishlistItems,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main
      className="
        flex-grow
        max-w-7xl
        w-full
        mx-auto
        px-4 sm:px-6 lg:px-8
        py-8 sm:py-10
      "
    >
      {/* Heading */}
      <div className="text-center mb-8">
        <h2
          className="
            inline-block
            text-2xl sm:text-3xl
            font-bold
            text-gray-900
            dark:text-white
            tracking-tight
            transition-colors duration-300
          "
        >
          Featured Products
        </h2>

        {/* Classic underline */}
        <div
          className="
            mt-3
            mx-auto
            w-16
            h-1
            bg-yellow-400
            rounded-full
          "
        />
      </div>

      {loading ? (
        /* Loading Spinner */
        <div
          className="
            min-h-[300px]
            flex flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              w-12 h-12
              border-4
              border-gray-200
              dark:border-gray-700
              border-t-blue-600
              dark:border-t-yellow-400
              rounded-full
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-sm sm:text-base
              font-medium
              text-gray-600
              dark:text-gray-300
            "
          >
            Loading Products...
          </p>
        </div>
      ) : products.length > 0 ? (
        <>
          {/* Product Grid */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              gap-5 sm:gap-6
            "
          >
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                wishlistItems={wishlistItems}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        /* Empty State */
        <div
          className="
            min-h-[220px]
            flex items-center justify-center
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              text-center
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-xl
              shadow-sm
              px-6 py-8
            "
          >
            <div className="text-4xl mb-3">
              🛍️
            </div>

            <p
              className="
                text-gray-600
                dark:text-gray-300
                font-medium
              "
            >
              No products found.
            </p>

            <p
              className="
                mt-1
                text-sm
                text-gray-400
                dark:text-gray-500
              "
            >
              Try searching for another product.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductList;
