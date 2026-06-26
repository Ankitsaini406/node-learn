import express from "express";
import urlRoute from "./routes/url.route.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

const api = "/api";

app.use(`${api}`, urlRoute);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
    });
});

export default app;