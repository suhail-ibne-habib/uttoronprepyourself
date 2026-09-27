import Link from "next/link";

export default function TopicTags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {tags.map((tag) =>
        tag.href ? (
          <Link
            key={`${tag.label}-${tag.href}`}
            href={tag.href}
            className="rounded-full border border-line bg-background px-2.5 py-0.5 text-[11px] font-medium text-forest hover:border-forest"
          >
            {tag.label}
          </Link>
        ) : (
          <span
            key={tag.label}
            className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {tag.label}
          </span>
        ),
      )}
    </div>
  );
}
