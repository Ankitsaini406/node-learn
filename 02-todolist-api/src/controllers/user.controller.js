import { User } from "../models/user.models.js"

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
