import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("TOKEN GENERATION ERROR:", error);
        throw error;
    }
}

export async function register(req, res) {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const exitingUser = await User.findOne({ email });

        if (exitingUser) {
            return res.status(409).json({
                success: false,
                message: `Account is already exits with ${email}`
            });
        }

        const user = await User.create({
            name, email, password
        });

        return res.status(201).json({
            success: true,
            message: "Account is created",
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid user email credentials"
            });
        }

        const isPassword = await user.isPasswordCorrect(password);

        if (!isPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid user credentials"
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const option = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                message: "User logged in successfully",
                data: loggedInUser, accessToken, refreshToken
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function logout(req, res) {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            returnDocument: "after"
        });

        const option = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json({
                success: true,
                data: {},
                message: "User logged out"
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export async function refreshAccessToken(req, res) {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or used"
            });
        }

        const option = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                data: { accessToken, refreshToken },
                message: "Access token refreshed"
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Invalid refresh token"
        });
    }
}