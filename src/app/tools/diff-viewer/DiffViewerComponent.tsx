"use client";

import React, { useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import TextArea from "@/app/components/common/TextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { ToolType } from "@prisma/client";
import { saveHistory } from "@/utils/clientUtils";

export default function DiffViewerComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [originalText, setOriginalText] = React.useState("");
  const [newText, setNewText] = React.useState("");

  const debouncedOriginalText = useDebounce<string>(originalText, 1000);

  useEffect(() => {
    if (debouncedOriginalText) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.DiffViewer,
        onError: () => {},
        metadata: {
          originalText,
        },
      });
    }
  }, [debouncedOriginalText]);

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
