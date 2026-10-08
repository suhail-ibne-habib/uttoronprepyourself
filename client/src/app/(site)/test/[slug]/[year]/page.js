"use client";

import { use } from "react";
import TestSession from "@/components/questions/TestSession";

export default function TestPage({ params }) {
  const { slug, year } = use(params);
  return <TestSession slug={slug} year={year} />;
}
