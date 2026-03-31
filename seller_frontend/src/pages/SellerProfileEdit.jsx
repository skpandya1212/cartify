import React, { useEffect, useState } from "react";
import { getSellerProfile, updateSellerProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./SellerProfileEdit.css";

function SellerProfileEdit() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePic: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH PROFILE (SAFE)
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getSellerProfile();

        setFormData({
          name: res.data?.name || "",
          email: res.data?.email || "",
          phone: res.data?.phone || "",
          address: res.data?.address || "",
          profilePic: res.data?.profilePic || ""
        });

      } catch (error) {
        console.error("Fetch Profile Error:", error);
        alert(error.response?.data?.message || "Failed to load profile ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // SUBMIT UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateSellerProfile(formData);

      alert("Profile updated successfully ✅");

      // ⚠️ Change this based on your routing
      navigate("/dashboard/seller/profile");

    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit} className="profile-form">

          {/* Profile Image Preview */}
          {formData.profilePic && (
            <img
              src={formData.profilePic}
              alt="preview"
              className="profile-preview"
            />
          )}

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />

          <input
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            placeholder="Profile Image URL"
          />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default SellerProfileEdit;