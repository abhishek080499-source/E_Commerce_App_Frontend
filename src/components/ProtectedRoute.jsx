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








// // components/ProtectedRoute.js

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const location = useLocation();

//   const savedUser = localStorage.getItem("user");

//   let user = null;

//   try {
//     user = savedUser ? JSON.parse(savedUser) : null;
//   } catch (error) {
//     console.error("Invalid user data in localStorage");

//     localStorage.removeItem("user");
//     user = null;
//   }

//   // User is not logged in
//   if (!user) {
//     return (
//       <Navigate
//         to="/create-account"
//         replace
//         state={{ from: location.pathname }}
//       />
//     );
//   }

//   // Check role only when allowedRoles are provided
//   if (
//     allowedRoles.length > 0 &&
//     !allowedRoles.includes(user.type)
//   ) {
//     // Admin trying to access customer page
//     if (user.type === "admin") {
//       return <Navigate to="/admin/dashboard" replace />;
//     }

//     // Customer trying to access admin page
//     if (user.type === "customer") {
//       return <Navigate to="/customer" replace />;
//     }

//     // Invalid role
//     localStorage.removeItem("user");

//     return <Navigate to="/create-account" replace />;
//   }

//   // User is authenticated
//   return children;
// };

// export default ProtectedRoute;
