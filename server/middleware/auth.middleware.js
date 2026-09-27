import mongoose from "mongoose";
import { fromNodeHeaders } from "better-auth/node";
import { getAuth } from "../lib/auth.js";
import { ApiError, asyncHandler } from "../lib/apiError.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const session = await getAuth().api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new ApiError(401, "Sign in required");
  }

  req.session = session.session;
  req.user = session.user;
  next();
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Sign in required");
  }

  const roles = String(req.user.role || "")
    .split(",")
    .map((role) => role.trim());

  if (!roles.includes("admin")) {
    throw new ApiError(403, "Admin access only");
  }

  next();
});

export function validateId(param = "id") {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return next(new ApiError(400, `Invalid ${param}`));
    }
    next();
  };
}
