import dns from "node:dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Restricted runtimes cannot replace the system resolver.
  }
}
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const connectionInstance = await mongoose.connect(uri, {
      dbName: DB_NAME,
    });
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
    return connectionInstance;
  } catch (error) {
    console.error("MONGODB connection FAILED", error?.message || error);
    throw error;
  }
};

export default connectDB;
