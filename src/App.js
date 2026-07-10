// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🔹 Auth & general pages
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import WorkInProgress from "./pages/WorkInProgress";
import NotFound from "./pages/NotFound";

// 🔹 Admin layout (with sidebar + header)
import AdminDashboard from "./admin/AdminDashBoard";

// 🔹 Admin pages
import AddProduct from "./admin/AddProducts";
import AllUsers from "./admin/AllUsers";
import Dashboard from "./admin/Dashboard";
import AllUsersBills from "./admin/AllUsersBills";
import ProductsDetails from "./admin/ProductsDetails";
import Categories from "./admin/Categories";
import AllProducts from "./admin/AllProducts";
import Notifications from "./admin/Notifications";

// 🔹 Customer pages
import CustomerHome from "./pages/CustumerHome";
import CartPage from "./pages/CartPage";
import Payment from "./pages/Payment";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";


import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Login />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin routes wrapped inside AdminDashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="all-users-bills" element={<AllUsersBills />} />
          <Route path="products-details" element={<ProductsDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="all-products" element={<AllProducts />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Customer routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* General routes */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/work-in-progress" element={<WorkInProgress />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
