import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { CLIENT_ORIGIN } from "./constants.js";
import { getAuth } from "./lib/auth.js";
import { prepare } from "./lib/prepare.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(async (req, res, next) => {
  try {
    await prepare();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", (req, res) => toNodeHandler(getAuth())(req, res));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));

app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.use(notFound);
app.use(errorHandler);

export { app };
export default app;
