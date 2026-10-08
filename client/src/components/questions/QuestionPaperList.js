"use client";

import QuestionCard from "@/components/questions/QuestionCard";

export default function QuestionPaperList({ questions }) {
  if (!questions?.length) {
    return <p className="text-sm text-muted-foreground">No published questions for this paper yet.</p>;
  }

  return (
    <div className="mt-8 space-y-5">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          selectedKey={null}
          flagged={false}
          explanationOpen={false}
          mode="study"
          onSelect={() => {}}
          onToggleFlag={() => {}}
          onToggleExplanation={() => {}}
        />
      ))}
    </div>
  );
}
