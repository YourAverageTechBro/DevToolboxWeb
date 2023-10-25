"use client";

import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import TextArea from "@/app/components/common/TextArea";

export default function DiffViewerComponent() {
  const [originalText, setOriginalText] = React.useState("");
  const [newText, setNewText] = React.useState("");
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex gap-4 h-1/2">
        <TextArea
          initialInput="hello world"
          title="Original:"
          onInputChange={(input) => setOriginalText(input)}
        />
        <TextArea
          initialInput={`hello world\nhello world diff`}
          title="New:"
          onInputChange={(input) => setNewText(input)}
        />
      </div>
      <ReactDiffViewer
        oldValue={originalText}
        newValue={newText}
        splitView
        useDarkTheme
      />
    </div>
  );
}
