import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import Products from "./pages/AllProducts/AllProducts";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import MyOrdersPage from "./pages/MyOrdersPage/MyOrdersPage";
import UserProfile from "./pages/UserProfile/UserProfile"



function App() {
  return (

    <>

    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/Profile" element={<UserProfile />} />
      </Routes>

        <Footer />
    </>
  );
}

export default App;