"use client";

import { useEffect, useState } from "react";
import Selector from "@/app/components/common/Selector";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

enum Option {
  encode = "encode",
  decode = "decode",
}

const options = [
  {
    label: "Encode",
    value: Option.encode,
  },
  {
    label: "Decode",
    value: Option.decode,
  },
];

export default function Bas64EncoderComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [currentOption, setCurrentOption] = useState<Option>(options[0].value);
  const debouncedOutput = useDebounce<string>(output, 1000);

  useEffect(() => {
    if (debouncedOutput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.Base64Encoder,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedOutput]);
  // Encode a string to Base64
  const encodeBase64 = (inputString: string) =>
    // Use the btoa function to encode the string to Base64
    btoa(inputString);

  // Decode a Base64 string to its original form
  const decodeBase64 = (base64String: string) =>
    // Use the atob function to decode the Base64 string
    atob(base64String);

  useEffect(() => {
    try {
      if (currentOption === Option.decode) {
        setOutput(decodeBase64(input));
      } else if (currentOption === Option.encode) {
        setOutput(encodeBase64(input));
      }
    } catch (e) {
      setOutput(
        `Invalid input — could not ${
          currentOption === Option.decode ? "decode" : "encode"
        } string`
      );
    }
  }, [currentOption, input, isProUser, user]);

  // Example usage
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
          <Selector
            values={options}
            handleClick={(entry) => {
              setCurrentOption(entry.value);
            }}
          />
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
      <ReadOnlyTextArea value={output} />
    </div>
  );
}
