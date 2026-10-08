import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-full bg-neutral-50" />}>
      <LoginForm />
    </Suspense>
  );
}
