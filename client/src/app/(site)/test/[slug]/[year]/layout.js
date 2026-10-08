export async function generateMetadata({ params }) {
  const { slug, year } = await params;
  return {
    title: `Test ${year}`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/question-bank/${slug}/${year}` },
  };
}

export default function TestLayout({ children }) {
  return children;
}
