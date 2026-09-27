"use client";

import Link from "next/link";
import { BookIcon } from "@/components/icons";
import { isAdmin, useAuth } from "@/hooks/use-auth";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest text-white">
            <BookIcon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg">Uttoron</span>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Prep yourself
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-ink sm:gap-5">
          <Link href="/question-bank" className="hover:text-forest">
            Question bank
          </Link>
          <Link href="/study" className="hover:text-forest">
            Study
          </Link>
          {loading ? null : user ? (
            <>
              <Link href="/profile" className="hover:text-forest">
                Profile
              </Link>
              {isAdmin(user) ? (
                <Link href="/dashboard" className="hover:text-forest">
                  Dashboard
                </Link>
              ) : null}
              <button type="button" onClick={signOut} className="hover:text-forest">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-forest">
                Login
              </Link>
              <Link href="/register" className="hover:text-forest">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
