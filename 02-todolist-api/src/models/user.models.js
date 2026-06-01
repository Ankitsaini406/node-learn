import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            unique: true,
            index: true,
            trim: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

/* ------------------ HASH PASSWORD ------------------ */

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

/* ------------------ COMPARE PASSWORD ------------------ */

userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/* ------------------ GENERATE TOKEN ------------------ */

userSchema.method.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
        }
    );
};

userSchema.method.generateRefreshToken = function () {  
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
        }
    );
};

export const User = mongoose.model("User", userSchema);
