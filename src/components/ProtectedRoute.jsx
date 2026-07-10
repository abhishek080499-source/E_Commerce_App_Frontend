// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    // redirect based on type
    return user.type === "admin" 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/customer" replace />;
  }

  return children;
};

export default ProtectedRoute;
