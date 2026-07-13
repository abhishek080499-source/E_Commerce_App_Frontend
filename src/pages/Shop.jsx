// src/pages/Shop.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../redux/cartSlice";


import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import SortNavbar from "../components/customerComponents/SortNavbar";
import CategoryNavbar from "../components/customerComponents/CategoryNavbar";
import ProductList from "../components/customerComponents/ProductList";
import Footer from "../components/customerComponents/Footer";

function Shop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Local State
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");



  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ==========================
  // Fetch Products
  // ==========================
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/products`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);


  // ==========================
  // Logout
  // ==========================
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

    localStorage.clear();
    localStorage.removeItem("theme");

    navigate("/login");
  };

  // ==========================
  // Search + Category Filter
  // ==========================
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.itemName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================
  // Sorting
  // ==========================
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.price - b.price;

    if (sortOption === "highToLow") return b.price - a.price;

    if (sortOption === "new")
      return new Date(b.createdAt) - new Date(a.createdAt);

    if (sortOption === "category")
      return (a.category?.name || "").localeCompare(
        b.category?.name || ""
      );

    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

      <SortNavbar
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <CategoryNavbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductList
        products={sortedProducts}
        loading={loading}
        wishlistItems={wishlistItems}
        addToCart={(product) =>
          dispatch(addToCart(product))
        }
      />

      <Footer />
    </div>
  );
}

export default Shop;