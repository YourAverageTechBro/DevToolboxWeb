import { JSONPath } from "jsonpath-plus";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import Selector from "@/app/components/common/Selector";
import { marked } from "marked";
import * as DOMPurify from 'dompurify';
import 'github-markdown-css';

type Props = {
  input: string;
  title?: string;
};
export default function FormattedMarkdownOutput({
  input,
  title = "Output",
}: Props) {
  const [output, setOutput] = useState("");

  const formatMarkdown = useCallback(
    (input: string) => {
        try {
            return DOMPurify.sanitize(
              marked(
                // remove the most common zerowidth characters from the start of the file
                input.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
              )
            )
        } catch (e: any) {
            if (e instanceof SyntaxError) {
              return e.message;
            }
        }
        return "";
    }, []
  )

  useEffect(() =>{
    const md = formatMarkdown(input);
    setOutput(md);
  })

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-4 gap-4 justify-between">
        <p className="font-bold text-xl"> {title}: </p>
        <div className="flex gap-4">
            <button
                  type="button"
                  className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={async () => {
                  await navigator.clipboard.writeText(input);
                  }}
              >
              Copy Input
            </button>
            <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                await navigator.clipboard.writeText(output);
                }}
            >
            Copy Output
          </button>
        </div>
        </div>
        <pre
        className="px-8 py-2 block rounded-lg border-0
        bg-gray-700 shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6 language-json whitespace-pre-wrap
        overflow-y-scroll markdown-body"
        dangerouslySetInnerHTML={{ __html: output }}
        style={{ height: "calc(100% - 44px)" }}
      />
    </div>
  );
}
