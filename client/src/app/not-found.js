import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        404
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Paper not found</h1>
      <p className="mt-3 text-muted-foreground">
        That exam or year is not in the archive yet. Pick a paper from the home
        list.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white hover:bg-forest/90"
      >
        Back to exams
      </Link>
    </div>
  );
}
