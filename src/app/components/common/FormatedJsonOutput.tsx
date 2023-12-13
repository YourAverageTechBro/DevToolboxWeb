import { JSONPath } from "jsonpath-plus";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import Selector from "@/app/components/common/Selector";

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
  const debouncedJsonPathFilter = useDebounce<string>(jsonPathFilter, 500);

  const syntaxHighlight = (json: string) =>
    json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
          let cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "text-blue-400";
            }
          } else if (/true|false/.test(match)) {
            cls = "text-purple-400";
          } else if (/null/.test(match)) {
            cls = "text-red-400";
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );

  const formatJson = useCallback(
    (json: string) => {
      try {
        return JSON.stringify(
          json ? JSON.parse(json) : {},
          null,
          numberOfSpaces
        );
      } catch (e: any) {
        if (e instanceof SyntaxError) {
          return e.message;
        }
      }
      return "";
    },
    [numberOfSpaces]
  );

  const [dangerousHtml, setDangerousHtml] = useState(
    syntaxHighlight(formatJson(value))
  );

  const filterJSONByJsonPath = (data: any, jsonPath: string): any => {
    try {
      return JSONPath({ path: jsonPath, json: data ?? {} });
    } catch (error: any) {
      return data;
    }
  };

  const setFormattedJson = (jsonString: string) => {
    const formattedJson = formatJson(jsonString);
    setOutput(formattedJson);
    setDangerousHtml(syntaxHighlight(formattedJson));
  };

  useEffect(() => {
    try {
      if (debouncedJsonPathFilter) {
        const filteredJson = JSON.stringify(
          filterJSONByJsonPath(
            JSON.parse(value !== "" ? value : "{}"),
            jsonPathFilter
          )
        );
        setFormattedJson(filteredJson);
      } else {
        setFormattedJson(value);
      }
    } catch (e: any) {
      setFormattedJson(value);
    }
  }, [
    formatJson,
    numberOfSpaces,
    value,
    debouncedJsonPathFilter,
    jsonPathFilter,
  ]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setJsonPathFilter(value);
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

      <pre
        className="px-4 py-2 block rounded-lg border-0
        bg-gray-700 shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6 language-json whitespace-pre-wrap
        overflow-y-scroll"
        dangerouslySetInnerHTML={{ __html: dangerousHtml }}
        style={{ height: "calc(100% - 96px)" }}
      />
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
