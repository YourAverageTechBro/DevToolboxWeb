"use client";

import { useEffect, useState } from "react";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

export default function AsciiConverterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [normalString, setNormalString] = useState("DevToolbox");
  const [asciiString, setAsciiString] = useState(
    "68 101 118 84 111 111 108 98 111 120"
  );

  const debouncedNormalString = useDebounce<string>(normalString, 1000);
  const debouncedAsciiString = useDebounce<string>(asciiString, 1000);

  useEffect(() => {
    if (debouncedNormalString && debouncedAsciiString) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.ColorConverter,
        onError: () => {},
        metadata: {
          normalString,
          asciiString,
        },
      });
    }
  }, [debouncedNormalString, debouncedAsciiString]);

  const stringToAscii = (input: string): string => {
    let result = "";

    for (let i = 0; i < input.length; i++) {
      const asciiValue = input.charCodeAt(i);
      result += `${asciiValue} `;
    }

    return result.trim();
  };

  const asciiToString = (input: string): string => {
    const asciiValues = input.split(" ").map(Number);

    const characters = asciiValues.map((asciiValue) =>
      String.fromCharCode(asciiValue)
    );

    return characters.join("");
  };

  const handleTextChange = (input: string) => {
    try {
      if (!input) {
        reset();
        return;
      }
      setNormalString(input);
      setAsciiString(stringToAscii(input));
    } catch (_) {
      reset();
    }
  };

  const handleAsciiChange = (input: string) => {
    try {
      if (!input) {
        reset();
        return;
      }
      setAsciiString(input);
      setNormalString(asciiToString(input));
    } catch (_) {
      reset();
    }
  };

  const reset = () => {
    setNormalString("");
    setAsciiString("");
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div>
        <p className="font-bold text-sm mb-2"> Text: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={normalString}
            onChange={(e) => handleTextChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(normalString);
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold text-sm mb-2"> ASCII: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={asciiString}
            onChange={(e) => handleAsciiChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(asciiString);
            }}
          >
            Copy
          </button>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={reset}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
