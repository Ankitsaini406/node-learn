import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

const api = '/api';

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
    });
});

app.use(errorMiddleware);

export default app;