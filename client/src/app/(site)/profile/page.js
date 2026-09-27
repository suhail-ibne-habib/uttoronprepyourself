"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/profile");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Profile
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">{user.name || "Your account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
    </div>
  );
}
