import React from "react";
import { Navigate } from "react-router-dom";

function AuthRedirect() {

  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }

}

export default AuthRedirect;