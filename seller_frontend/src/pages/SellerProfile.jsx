import React, { useEffect, useState } from "react";
import { getSellerProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./SellerProfile.css";

function SellerProfile() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePic: ""
  });

  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {

    try {

      const res = await getSellerProfile();
      setUser(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchProfile();
  }, []);


  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }


  return (

    <div className="profile-container">

      <div className="profile-card">

        {/* Header */}
        <div className="profile-header">

          <h2>Seller Profile</h2>

          <button
            className="profile-edit-btn"
            onClick={() => navigate("/seller/profile/edit")}
          >
            Edit Profile
          </button>

        </div>


        {/* Profile Body */}
        <div className="profile-body">

          {/* Left Side Image */}
          <div className="profile-left">

            <img
              src={
                user.profilePic ||
                "https://dummyimage.com/150x150/cccccc/000000&text=Profile"
              }
              alt="profile"
              className="profile-image"
            />

          </div>


          {/* Right Side Info */}
          <div className="profile-right">

            <div className="profile-info">
              <span>Name</span>
              <p>{user.name}</p>
            </div>

            <div className="profile-info">
              <span>Email</span>
              <p>{user.email}</p>
            </div>

            <div className="profile-info">
              <span>Phone</span>
              <p>{user.phone}</p>
            </div>

            <div className="profile-info">
              <span>Address</span>
              <p>{user.address}</p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default SellerProfile;