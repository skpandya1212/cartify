import React from "react";
import Seller_Register from "./components/Seller_Register";
import Seller_Login from './components/Seller_Login'
import { Route,Routes } from "react-router-dom";
import AuthRedirect from "./routes/AuthRedirect";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Home from "./pages/Home";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import SellerHome from "./pages/SellerHome";
import ProductList from "./pages/ProductList"
import EditProduct from "./pages/EditProduct";
import SellerProfile from "./pages/SellerProfile";
import ForgotPassword from "./components/ForgotPassword";
import SellerOrdersPage from "./pages/SellerOrdersPage";

function App(){
  return(

    <div>

       <Routes>

      {/* Public Routes */}

      <Route path="/" element={<AuthRedirect />} />

      <Route path="/login" element={<Seller_Login />} />

      <Route path="/register" element={<Seller_Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* Protected Route */}

      {/* <Route
      {/* Protected */}
      <Route
        path="/dashboard" element={
          <ProtectedRoute>
            <SellerDashboard />
          </ProtectedRoute>
        }
      >

          {/* Nested Routes */}
          <Route index element={<SellerHome />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ProductList />} />
           <Route path="edit-product/:id" element={<EditProduct />} />
           <Route path="profile" element={<SellerProfile />} />
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="orders" element={<SellerOrdersPage />} />

        </Route>


    </Routes>


    </div>

  )
}

export default App