"use client";

import { useEffect, useState } from "react";
import Selector from "@/app/components/common/Selector";
import TextArea from "@/app/components/common/TextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

const convertToSnakeCase = (input: string): string =>
  input
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();

const convertToCamelCase = (input: string): string =>
  input
    .replace(/[\s_-]+./g, (match) =>
      match.charAt(match.length - 1).toUpperCase()
    )
    .replace(/^[A-Z]/, (match) => match.toLowerCase());

const convertToKebabCase = (input: string): string =>
  input
    .replace(/\s+/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

const convertToPascalCase = (input: string): string => {
  const camelCase = convertToCamelCase(input);
  const firstChar = camelCase.charAt(0).toUpperCase();
  return firstChar + camelCase.slice(1);
};

const convertToUpperCase = (input: string): string => input.toUpperCase();

const convertToScreamKebabCase = (input: string): string =>
  convertToKebabCase(input).toUpperCase();

const convertToConstantCase = (input: string): string =>
  convertToSnakeCase(input).toUpperCase();

enum TransformationOption {
  camelCase = "camelCase",
  snakeCase = "snakeCase",
  kebabCase = "kebabCase",
  pascalCase = "pascaleCase",
  upperCase = "upperCase",
  screamKebab = "screamKebabCase",
  constantCase = "constantCase",
}

const options = [
  {
    label: "camelCase",
    value: TransformationOption.camelCase,
  },
  {
    label: "snake_case",
    value: TransformationOption.snakeCase,
  },
  {
    label: "kebab-case",
    value: TransformationOption.kebabCase,
  },
  {
    label: "PascalCase",
    value: TransformationOption.pascalCase,
  },
  {
    label: "UPPER CASE",
    value: TransformationOption.upperCase,
  },
  {
    label: "SCREAM-KEBAB",
    value: TransformationOption.screamKebab,
  },
  {
    label: "CONSTANTS_CASE",
    value: TransformationOption.constantCase,
  },
];
export default function StringConverterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [transformationOption, setTransformationOption] =
    useState<TransformationOption>(options[0].value);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const debouncedOutput = useDebounce(output, 1000);

  useEffect(() => {
    if (debouncedOutput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.StringConverter,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedOutput]);
  const transformText = (text: string) => {
    switch (transformationOption) {
      case TransformationOption.camelCase:
        return convertToCamelCase(text);
      case TransformationOption.snakeCase:
        return convertToSnakeCase(text);
      case TransformationOption.kebabCase:
        return convertToKebabCase(text);
      case TransformationOption.pascalCase:
        return convertToPascalCase(text);
      case TransformationOption.upperCase:
        return convertToUpperCase(text);
      case TransformationOption.screamKebab:
        return convertToScreamKebabCase(text);
      case TransformationOption.constantCase:
        return convertToConstantCase(text);
      default:
        break;
    }
    return text;
  };
  return (
    <div className="w-full h-full flex gap-4">
      <TextArea
        initialInput="snake_case_to_camel_case"
        onInputChange={(input) => {
          setInput(input);
          setOutput(transformText(input));
        }}
      />
      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4 justify-between">
          <p className="font-bold text-xl"> Output: </p>
          <Selector
            values={options}
            handleClick={(filterOption) => {
              setTransformationOption(filterOption.value);
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
