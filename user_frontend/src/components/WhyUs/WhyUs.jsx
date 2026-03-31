import React from "react";
import { FaTruck, FaLock, FaHeadset, FaCheckCircle } from "react-icons/fa";
import "./WhyUs.css";

function WhyUs() {
  const features = [
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      desc: "Get your products delivered quickly at your doorstep",
    },
    {
      icon: <FaLock />,
      title: "Secure Payment",
      desc: "100% secure payment with trusted gateways",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "We are here to help you anytime, anywhere",
    },
    {
      icon: <FaCheckCircle />,
      title: "Quality Products",
      desc: "We provide only high-quality and verified products",
    },
  ];

  return (
    <section className="why-us">
      <h2>Why Shop With Us</h2>

      <div className="why-us-grid">
        {features.map((item, index) => (
          <div key={index} className="why-card">
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyUs;