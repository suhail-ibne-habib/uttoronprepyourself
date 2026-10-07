import "dotenv/config";
import dotenv from "dotenv";
import { app } from "./app.js";
import { prepare } from "./lib/prepare.js";

dotenv.config({
  path: "./.env",
});

prepare()
  .then(() => {
    if (process.env.VERCEL) return;

    const port = process.env.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
    server.on("error", (error) => {
      console.error(`Server failed to listen on port ${port}: ${error.message}`);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
    if (!process.env.VERCEL) process.exit(1);
  });

export default app;
