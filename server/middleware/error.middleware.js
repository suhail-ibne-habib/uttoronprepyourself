import { ApiError } from "../lib/apiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  void next;
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(", ");
    message = fields ? `Duplicate value for ${fields}` : "Duplicate value";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
}
