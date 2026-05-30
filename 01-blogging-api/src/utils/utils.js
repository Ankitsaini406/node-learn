import { redisClient } from "../config/config.js";

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "" ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export const validateAllowedFields = (body, allowedFields) => {
  const receivedFields = Object.keys(body);

  const extraFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    throw new ApiError(
      400,
      `Invalid fields: ${extraFields.join(", ")}. Remove extra fields.`
    );
  }
};

export function generateCacheKey(req) {
    const baseUrl = req.path.replace(/^\/+|\/+$/g, '').replace(/\//g, ':');
    const params = req.query;
    const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
    return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
};

export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.log(error);
    }
};

export const setCache = async (key, value, expiry = 120) => {
    try {
        await redisClient.setEx(key, expiry, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
};

export const delCache = async (key) => {
    try {
    const keys = await redisClient.keys(key);
    if (keys.length > 0) {
        await redisClient.del(key);
    }
    } catch (error) {
        console.log(error)
    }
};
