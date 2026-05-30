import express from "express";
import rateLimit from "express-rate-limit";

import errorMiddleware from "./middleware/error.middleware.js";
import weatherRouter from "./routes/weather.route.js";

const app = express();

/* -------------------------- BODY PARSER -------------------------- */

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

/* -------------------------- RATE LIMITER -------------------------- */

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/* -------------------------- ROUTES -------------------------- */

const api = "/api";

app.use(`${api}/weather`, weatherRouter);

/* -------------------------- HEALTH CHECK -------------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Weather API Server Running",
  });
});

/* -------------------------- 404 HANDLER -------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
  });
});

/* -------------------------- ERROR HANDLER -------------------------- */

app.use(errorMiddleware);

export default app;