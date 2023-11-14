"use client";

import { useEffect, useState } from "react";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

export default function RegexCheckerComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [regexExpression, setRegexExpression] = useState(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}"
  );
  const [input, setInput] = useState(
    "Hello, my email addresses are john@example.com and jane@example.com"
  );
  const [output, setOutput] = useState("");

  const debouncedOutput = useDebounce(output, 1000);

  useEffect(() => {
    const regex = new RegExp(regexExpression);
    const matches = input.match(regex);
    setOutput(matches ? matches.join(', ') : 'No matches found');
  }, []);

  useEffect(() => {
    if (debouncedOutput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.RegexChecker,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedOutput]);

useEffect(() => {
  const processString = () => {
    try {
      // Write code that matches the input against the regex expression and return list of all matches
      if (!regexExpression) {
        setOutput("");
        return;
      }
      const regex = new RegExp(regexExpression, "g");
      const matches: string[] = [];
      let match: RegExpExecArray | null;

      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(input)) !== null) {
        matches.push(match[0]);
      }
      setOutput(matches.join("\n"));
    } catch (_) {
      setOutput("");
    }
  };
  processString();
},[input, regexExpression])

 

  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4">
          <p className="font-bold text-xl"> Input: </p>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => setInput("")}
          >
            Clear
          </button>
        </div>
        <input
          className={`px-8 mt-4 block w-full rounded-md border-0 py-1.5
      text-white shadow-sm ring-1 ring-inset ring-gray-300
      placeholder:text-gray-400 focus:ring-2 focus:ring-inset
      focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-600 mb-4`}
          placeholder="Regex Expression: e.g. $.school.class[0].student"
          value={regexExpression}
          onChange={(e) => setRegexExpression(e.currentTarget.value)}
        />
        <textarea
          className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
          style={{ height: "calc(100% - 96px)" }}
          value={input}
          onInput={(e) => setInput(e.currentTarget.value)}
        />
      </div>
      <ReadOnlyTextArea value={output} />
    </div>
  );
}
