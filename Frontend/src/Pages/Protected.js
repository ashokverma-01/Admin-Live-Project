// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
    const data = localStorage.getItem("userEmail");
    return data ? children : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;