import ExamCapsules from "@/components/questions/ExamCapsules";
import { fetchPublic, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: siteTitle,
    description: siteDescription,
  },
};

const points = [
  {
    title: "Sit the paper",
    text: "Pick a published paper. The answers stay hidden for the full hour.",
  },
  {
    title: "See the mark",
    text: "The clock and the score stay on screen. A correct answer is +1. A mistake is −0.25.",
  },
  {
    title: "Read why",
    text: "After you submit, each miss opens the explanation.",
  },
];

export default async function Home() {
  const bank = await fetchPublic("/question-bank");

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-paper px-6 py-10 sm:px-12 sm:py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
            }),
          }}
        />
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#c47a28]">NTRC, BCS, bank and other job exams</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl">
              Practise the paper, then learn what you missed.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Past papers for NTRC, BCS, bank and other Bangladesh job exams.
            </p>
          </div>
          <div className="shrink-0">
            <div className="flex items-start gap-10 sm:gap-14">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Time</p>
                <p className="mt-2 font-serif text-5xl leading-none text-forest sm:text-6xl">60:00</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mark</p>
                <p className="mt-2 font-serif text-5xl leading-none text-ink sm:text-6xl">+1</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink/60">One hour. −0.25 for each mistake.</p>
          </div>
        </div>

        <div id="start" className="mt-12 border-t border-ink/10 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Take test</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">Choose a paper</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-ink/60">
            Each paper is a one-hour test. The answers stay hidden until you submit.
          </p>
          <div className="mt-6">
            <ExamCapsules exams={bank?.exams} mode="test" />
          </div>
        </div>

        <dl className="mt-16 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title}>
              <dt className="font-serif text-2xl text-ink">{point.title}</dt>
              <dd className="mt-2 max-w-xs text-sm leading-6 text-ink/60">{point.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
