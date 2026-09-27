import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { CLIENT_ORIGIN } from "./constants.js";
import { getAuth } from "./lib/auth.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();
  const auth = getAuth();

  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true,
    }),
  );

  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(express.static("public"));

  app.use("/api/admin", adminRoutes);
  app.use("/api", publicRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
