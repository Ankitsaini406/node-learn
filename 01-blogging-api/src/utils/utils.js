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