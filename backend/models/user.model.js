import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: Number,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
    },

},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
