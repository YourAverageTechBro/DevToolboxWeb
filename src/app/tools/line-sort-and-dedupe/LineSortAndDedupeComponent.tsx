"use client";

import { useEffect, useState } from "react";
import Selector from "@/app/components/common/Selector";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

enum SortingOption {
  AtoZ = "AtoZ",
  ZtoA = "ZtoA",
  AscendingNumbers = "AscendingNumbers",
  DescendingNumbers = "DescendingNumbers",
  None = "None",
}

const sortingOptions = [
  {
    label: "A to Z",
    value: SortingOption.AtoZ,
  },
  {
    label: "Z to A",
    value: SortingOption.ZtoA,
  },
  {
    label: "Ascending Numbers",
    value: SortingOption.AscendingNumbers,
  },
  {
    label: "Descending Numbers",
    value: SortingOption.DescendingNumbers,
  },
  {
    label: "None",
    value: SortingOption.None,
  },
];

enum DedupingOptions {
  Dedupe = "Dedupe",
  None = "None",
}

const dedupingOptions = [
  {
    label: "Dedupe",
    value: DedupingOptions.Dedupe,
  },
  {
    label: "None",
    value: DedupingOptions.None,
  },
];
export default function LineSortAndDedupeComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [currentSortingOption, setCurrentSortingOption] =
    useState<SortingOption>(SortingOption.AtoZ);
  const [currentDedupingOption, setCurrentDedupingOption] =
    useState<DedupingOptions>(DedupingOptions.Dedupe);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const debouncedOutput = useDebounce(output, 1000);

  useEffect(() => {
    if (debouncedOutput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.LineSortAndDedupe,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedOutput]);

  const dedupeString = (
    stringToDedupe: string,
    dedupingOption: DedupingOptions
  ) => {
    setCurrentDedupingOption(dedupingOption);
    if (dedupingOption === DedupingOptions.None) return stringToDedupe;
    const lines = stringToDedupe.split("\n");
    // @ts-ignore
    const dedupedLines = [...new Set(lines)];
    return dedupedLines.join("\n");
  };

  const sortString = (stringToSort: string, sortingOption: SortingOption) => {
    setCurrentSortingOption(sortingOption);
    if (sortingOption === SortingOption.AtoZ) {
      return stringToSort.split("\n").sort().join("\n");
    }
    if (sortingOption === SortingOption.ZtoA) {
      return stringToSort.split("\n").sort().reverse().join("\n");
    }
    if (sortingOption === SortingOption.AscendingNumbers) {
      return stringToSort
        .split("\n")
        .sort((a, b) => Number(a) - Number(b))
        .join("\n");
    }
    if (sortingOption === SortingOption.DescendingNumbers) {
      return stringToSort
        .split("\n")
        .sort((a, b) => Number(b) - Number(a))
        .join("\n");
    }
    return stringToSort;
  };

  const processString = (
    stringToProcess: string,
    sortingOption: SortingOption,
    dedupingOption: DedupingOptions
  ) => {
    const dedupedString = dedupeString(stringToProcess, dedupingOption);
    return sortString(dedupedString, sortingOption);
  };

  const onInputChange = (input: string) => {
    setInput(input);
    setOutput(
      processString(input, currentSortingOption, currentDedupingOption)
    );
  };

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
        <textarea
          className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
          style={{ height: "calc(100% - 44px)" }}
          value={input}
          onInput={(e) => onInputChange(e.currentTarget.value)}
        />
      </div>
      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4 justify-between">
          <p className="font-bold text-xl"> Output: </p>
          <Selector
            values={sortingOptions}
            handleClick={(entry) => {
              const sortedString = processString(
                input,
                entry.value,
                currentDedupingOption
              );
              setOutput(sortedString);
            }}
          />
          <Selector
            values={dedupingOptions}
            handleClick={(entry) => {
              const dedupedString = processString(
                input,
                currentSortingOption,
                entry.value
              );
              setOutput(dedupedString);
            }}
          />
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
