import app from './app.js';
import db from '../config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
        process.on("SIGTERM", () => shutdown(server));
        process.on("SIGINT", () => shutdown(server));

    } catch (error) {
        console.error("❌ Failed to connect to database:", error.message);
        process.exit(1);
    }
};

function shutdown(server) {
    console.log("🛑 Shutting down server...");
    server.close(() => {
        console.log("💤 Server closed");
        process.exit(0);
    });
}

startServer();