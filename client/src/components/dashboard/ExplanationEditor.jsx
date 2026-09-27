"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-40 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

const toolbar = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["blockquote", "link"],
  ["clean"],
];

export default function ExplanationEditor({ value, onChange }) {
  const modules = useMemo(() => ({ toolbar }), []);

  return (
    <div className="explanation-editor">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder="Write the explanation. You can bold, list, and link text."
      />
    </div>
  );
}
