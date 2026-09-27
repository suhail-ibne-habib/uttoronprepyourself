import { ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";
import mongoose from "mongoose";
import { getAuth } from "./auth.js";

function userIdString(user) {
  return String(user.id || user._id);
}

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD missing — admin was not seeded");
    return;
  }

  const db = mongoose.connection.db;
  const users = db.collection("user");
  const accounts = db.collection("account");
  const auth = getAuth();
  const now = new Date();

  let user = await users.findOne({ email });

  if (!user) {
    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: "Admin",
        },
      });
    } catch (error) {
      console.warn("Admin sign-up skipped:", error?.message || error);
    }
    user = await users.findOne({ email });
  }

  if (!user) {
    console.warn("Failed to create admin user");
    return;
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        role: "admin",
        banned: false,
        emailVerified: true,
        updatedAt: now,
      },
    },
  );

  const userId = userIdString(user);
  const hashed = await hashPassword(password);
  const account =
    (await accounts.findOne({
      providerId: "credential",
      userId: user._id,
    })) ||
    (await accounts.findOne({
      providerId: "credential",
      userId,
    }));

  if (account) {
    await accounts.updateOne(
      { _id: account._id },
      {
        $set: {
          password: hashed,
          accountId: userId,
          updatedAt: now,
        },
      },
    );
  } else {
    await accounts.insertOne({
      _id: new ObjectId(),
      userId: user._id,
      accountId: userId,
      providerId: "credential",
      password: hashed,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(`Admin ready: ${email}`);
}
