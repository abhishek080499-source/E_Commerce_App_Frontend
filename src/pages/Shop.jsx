// src/pages/Shop.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";   // <-- Redux action
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import SortNavbar from "../components/customerComponents/SortNavbar";
import CategoryNavbar from "../components/customerComponents/CategoryNavbar";
import ProductList from "../components/customerComponents/ProductList";
import Footer from "../components/customerComponents/Footer";

function Shop() {
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
          `${process.env.REACT_APP_API_URL}/products`,
          { credentials: "include" }
        );
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Sort Navbar */}
      <SortNavbar sortOption={sortOption} setSortOption={setSortOption} />

      {/* Category Navbar */}
      <CategoryNavbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        />

      {/* Product List */}
      <ProductList
        products={sortedProducts}
        loading={loading}
        addToCart={(product) => dispatch(addToCart(product))}
        />
        

      <Footer />
    </div>
  );
}

export default Shop;
