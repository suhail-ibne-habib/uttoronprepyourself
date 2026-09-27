"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdmin, useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin(user)) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading || !user || !isAdmin(user)) {
    return (
      <div className="flex min-h-svh flex-1 flex-col gap-3 bg-neutral-50 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return children;
}
