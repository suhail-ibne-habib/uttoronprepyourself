"use client";

import Link from "next/link";

function TreeLinks({ nodes, activeSlug }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <li key={node.id || node.slug}>
          {node.href ? (
            <Link
              href={node.href}
              className={`block rounded-md px-2 py-1.5 text-sm ${
                activeSlug === node.slug
                  ? "bg-forest text-white"
                  : "text-ink hover:bg-forest-soft"
              }`}
            >
              {node.title}
            </Link>
          ) : (
            <p className="px-2 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {node.title}
            </p>
          )}
          {node.children?.length ? (
            <div className="ml-2 border-l border-line pl-2">
              <TreeLinks nodes={node.children} activeSlug={activeSlug} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function StudySidebar({ subject, tree, activeSlug }) {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-line bg-paper p-4 lg:w-64">
      <Link href="/study" className="text-xs text-muted-foreground hover:text-forest">
        All subjects
      </Link>
      <h2 className="mt-2 font-serif text-xl text-ink">{subject?.name}</h2>
      <nav className="mt-4">
        <TreeLinks nodes={tree || []} activeSlug={activeSlug} />
      </nav>
    </aside>
  );
}
