import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
    const [method, setMethod] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    const address = localStorage.getItem("shippingAddress");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalAmount = Number(localStorage.getItem("totalAmount")) || 0;
    const items = cartItems.map(item => ({
        product_id: item.product_id?._id,
        seller_id: item.product_id?.seller,
        product_name: item.product_id?.name,
        price: item.product_id?.price,
        quantity: item.quantity,
        subtotal: item.product_id?.price * item.quantity
    }));
    // =========================
    // HANDLE PAYMENT
    // =========================
    const handlePayment = async () => {
        if (!method) {
            alert("Select payment method");
            return;
        }

        if (!token) {
            alert("User not logged in ❌");
            return;
        }

        if (!address) {
            alert("Shipping address missing ❌");
            return;
        }

        try {
            setLoading(true);

            // ✅ KEEP SAME VALUES AS BACKEND ENUM
            let paymentMethod = method === "COD" ? "COD" : "ONLINE";
            // COD | UPI | Card

            // =========================
            // 👉 FAKE ONLINE PAYMENT SUCCESS
            // =========================
            if (paymentMethod === "UPI" || paymentMethod === "Card") {
                alert("Payment Successful ✅");
            }

            // =========================
            // 👉 CREATE ORDER
            // =========================
            const { data } = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    shipping_address: address,
                    payment_method: paymentMethod,
                    payment_status: paymentMethod === "ONLINE" ? "Paid" : "Unpaid",
                    items,
                    total_amount: totalAmount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("✅ ORDER:", data);

            alert("Order Placed Successfully 🎉");

            // ✅ CLEAR ADDRESS
            localStorage.removeItem("shippingAddress");
            localStorage.removeItem("cartItems");
            localStorage.removeItem("totalAmount");
            // ✅ REDIRECT (make sure route exists)
            navigate("/my-orders");

        } catch (error) {
            console.log("❌ ERROR:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Payment failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-page">
            <h2>Select Payment Method</h2>

            <div className="methods">

                {/* COD */}
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="method-content">
                        <div className="method-info">
                            <div className="radio-circle"></div>
                            <span>Cash on Delivery</span>
                        </div>
                    </div>
                </label>

                {/* UPI */}
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="method-content">
                        <div className="method-info">
                            <div className="radio-circle"></div>
                            <span>UPI</span>
                        </div>
                    </div>
                </label>

                {/* CARD */}
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="Card"
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <div className="method-content">
                        <div className="method-info">
                            <div className="radio-circle"></div>
                            <span>Credit / Debit Card</span>
                        </div>
                    </div>
                </label>

            </div>

            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
}

export default PaymentPage;