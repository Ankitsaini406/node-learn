import app from "./app.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

await connectRedis();

async function startServer() {
    try {
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // graceful shutdown
        process.on("SIGTERM", () => shutdown(server));
        process.on("SIGINT", () => shutdown(server));

    } catch (error) {
        console.error("❌ Failed to connect to database:", error.message);
        process.exit(1);
    }
};

startServer();

function shutdown(server) {
    console.log("🛑 Shutting down server...");
    server.close(() => {
        console.log("💤 Server closed");
        process.exit(0);
    });
}