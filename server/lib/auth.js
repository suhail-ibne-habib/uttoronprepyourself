import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import mongoose from "mongoose";
import { CLIENT_ORIGIN } from "../constants.js";

let authInstance;

function createAuth() {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB must be connected before initializing auth");
  }

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is missing in .env");
  }

  return betterAuth({
    secret,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
    trustedOrigins: [
      CLIENT_ORIGIN,
      "http://localhost:8080",
      process.env.BETTER_AUTH_URL,
    ].filter(Boolean),
    database: mongodbAdapter(mongoose.connection.db, {
      client: mongoose.connection.getClient(),
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      minPasswordLength: 8,
    },
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
      }),
    ],
    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  });
}

export function initAuth() {
  authInstance = createAuth();
  return authInstance;
}

export function getAuth() {
  if (!authInstance) {
    throw new Error("Auth has not been initialized yet");
  }
  return authInstance;
}
