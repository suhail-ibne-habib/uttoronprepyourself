export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/40 bg-sage">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Uttoron is a study aid. Always verify answers against official circulars.</p>
        <p>© {new Date().getFullYear()} Uttoron</p>
      </div>
    </footer>
  );
}
