// src/pages/CustomerHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";   // Redux action
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import SortNavbar from "../components/customerComponents/SortNavbar";
import CategoryNavbar from "../components/customerComponents/CategoryNavbar";
import HeroBanner from "../components/customerComponents/HeroBanner";
import ProductList from "../components/customerComponents/ProductList";
import Footer from "../components/customerComponents/Footer";

function CustomerHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux cart state
  const cartItems = useSelector((state) => state.cart.items);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");


const user = JSON.parse(localStorage.getItem("user"));
const username = user?.username;


  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/products`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/auth/logout`,
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

  // Filter + Sort combined
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ? true : product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.price - b.price;
    if (sortOption === "highToLow") return b.price - a.price;
    if (sortOption === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "category")
      return (a.category?.name || "").localeCompare(b.category?.name || "");
    return 0;
  });

  // ✅ Featured Products: only 10 products from 10 different categories
  const categoryMap = new Map();
  sortedProducts.forEach((product) => {
    const catId = product.category?._id;
    if (catId && !categoryMap.has(catId)) {
      categoryMap.set(catId, product);
    }
  });
  const featuredProducts = Array.from(categoryMap.values()).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Navbar */}
      <CategoryNavbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Sort Navbar */}
      <SortNavbar sortOption={sortOption} setSortOption={setSortOption} />

      {/* Product List - show featured OR all */}
      <ProductList
        products={featuredProducts.length > 0 ? featuredProducts : sortedProducts}
        loading={loading}
        addToCart={(product) => dispatch(addToCart(product))}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CustomerHome;
