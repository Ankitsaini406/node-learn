import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

async function db() {
    try {
        const connectInstance = await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log(`✅ MongoDB connected: ${connectInstance.connection.host}`);
        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB error:", err);
        });
    } catch (error) {
        console.error("❌ MongoDB connection Failed", error);
        process.exit(1);
    }
};

export default db;