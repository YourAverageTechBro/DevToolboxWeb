"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Selector from "@/app/components/common/Selector";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

enum FilterOption {
  Character = "Character",
  Word = "Word",
  Line = "Line",
  CustomDelimiter = "Custom Delimiter",
}

const filterOptions = [
  {
    label: "Character",
    value: FilterOption.Character,
  },
  { label: "Word", value: FilterOption.Word },
  { label: "Line", value: FilterOption.Line },
  { label: "Custom Delimiter", value: FilterOption.CustomDelimiter },
];

export default function CharacterAndWordCounterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [count, setCount] = useState<number>(0);
  const [currentFilterOption, setCurrentFilterOption] = useState(
    filterOptions[0].value
  );
  const [filter, setFilter] = useState("");

  const debouncedInput = useDebounce<string>(input, 1000);

  useEffect(() => {
    if (debouncedInput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.CharacterAndWordCounter,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedInput]);

  useEffect(() => {
    switch (currentFilterOption) {
      case FilterOption.Character:
        setCount(input.length);
        setOutput(input.split("").join("\n"));
        break;
      case FilterOption.CustomDelimiter:
        setCount(input.split(filter).length);
        setOutput(input.split(filter).join("\n"));
        break;
      case FilterOption.Word:
        setCount(input.split(" ").length);
        setOutput(input.split(" ").join("\n"));
        break;
      case FilterOption.Line:
        setCount(input.trim().split("\n").length);
        setOutput(input)
      default:
        break;
    }
  }, [input, currentFilterOption, filter]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilter(value);
  };

  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-full h-full">
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="flex gap-4 items-center">
            <p className="font-bold text-xl"> Input: </p>
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => setInput("")}
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
          style={{ height: "calc(100% - 44px)" }}
          value={input}
          onInput={(e) => setInput(e.currentTarget.value)}
        />
      </div>

      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4 justify-between">
          <p className="font-bold text-xl"> Output: </p>
          <div className="flex gap-4 items-center justify-end w-full">
            <Selector
              values={filterOptions}
              handleClick={(filterOption) => {
                setCurrentFilterOption(filterOption.value);
              }}
            />
            {currentFilterOption === FilterOption.CustomDelimiter && (
              <input
                className={`block w-1/4 rounded-md border-0 py-1.5
      text-white shadow-sm ring-1 ring-inset ring-gray-300
      placeholder:text-gray-400 focus:ring-2 focus:ring-inset
      focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-600`}
                placeholder={currentFilterOption}
                value={filter}
                onChange={handleChange}
              />
            )}
            <p className="font-bold text-md"> count: {count}</p>
          </div>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(output);
            }}
          >
            Copy
          </button>
        </div>
        <textarea
          readOnly
          className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
          style={{ height: "calc(100% - 44px)" }}
          value={output}
        />
      </div>
    </div>
  );
}
