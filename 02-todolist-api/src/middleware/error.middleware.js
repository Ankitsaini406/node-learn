
export default function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        console.log("ERROR ", err);
    }

    const message = process.env.NODE_ENV === "production" && !err.isOperational
        ? "Internal Serve Error"
        : err.message;

    res.status(statusCode).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}