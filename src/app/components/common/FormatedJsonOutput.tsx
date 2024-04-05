import { JSONPath } from "jsonpath-plus";
import { ChangeEvent, useEffect, useState } from "react";
import Selector from "@/app/components/common/Selector";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"));

type SpacingOption = {
  value: number;
  label: string;
};

const spacingOptions: SpacingOption[] = [
  { value: 2, label: "2 spaces" },
  { value: 4, label: "4 spaces" },
  { value: 8, label: "8 spaces" },
  { value: 16, label: "16 spaces" },
];

type Props = {
  value: string;
  title?: string;
};
export default function FormattedJsonOutput({
  value,
  title = "Output",
}: Props) {
  const [jsonPathFilter, setJsonPathFilter] = useState("");
  const [numberOfSpaces, setNumberOfSpaces] = useState(2);
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const path = event.target.value;
    setJsonPathFilter(path);
    if (!path.length) {
      setOutput(value);
      return;
    }
    try {
      const json = JSON.parse(value);
      const newOutput = JSONPath({ path, json });
      setOutput(JSON.stringify(newOutput));
    } catch (error) {
      setOutput(value);
      return;
    }
  };

  const outputBlock = (__html: string = "") => {
    return (
      <pre
        className="px-4 py-2 block rounded-lg border-0 whitespace-pre-wrap overflow-y-scroll"
        dangerouslySetInnerHTML={{ __html }}
        style={{ height: "calc(100% - 96px)" }}
      />
    );
  };

  const JsonObject = ({ value }: { value: string }) => {
    try {
      const emptyBraces = `<span class="text-white-400">{}</span>`;
      if (!value.length || typeof document === undefined) {
        return outputBlock(emptyBraces);
      }
      const jsonValue = JSON.parse(value);
      if (typeof jsonValue !== "object") return outputBlock(emptyBraces);
      setOutput(value);
      return (
        <div
          style={{ height: "calc(100% - 96px)" }}
          className="rounded-md  overflow-y-scroll bg-gray-860"
        >
          <ReactJson
            displayDataTypes={false}
            enableClipboard={false}
            indentWidth={numberOfSpaces}
            src={jsonValue}
            theme="shapeshifter"
          />
        </div>
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const dangerousHtml = `<span class="text-red-400">${message}</span>`;
      return outputBlock(dangerousHtml);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-4 gap-4 justify-between">
        <p className="font-bold text-xl"> {title}: </p>
        <div className="flex gap-4">
          <Selector
            title="Spacing"
            values={spacingOptions}
            handleClick={(spacingOption) => {
              setNumberOfSpaces(spacingOption.value as number);
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
      </div>

      <JsonObject value={output} />
      <input
        className={`mt-4 px-8 block w-full rounded-md border-0 py-1.5
      text-white shadow-sm ring-1 ring-inset ring-gray-300
      placeholder:text-gray-400 focus:ring-2 focus:ring-inset
      focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-600`}
        placeholder="JSON path filter: e.g. $.store.book[*].author"
        value={jsonPathFilter}
        onChange={handleChange}
      />
    </div>
  );
}
