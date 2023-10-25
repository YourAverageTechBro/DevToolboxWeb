"use client";

import { useEffect, useState } from "react";
import TextArea from "@/app/components/common/TextArea";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import { User } from "@clerk/backend";
import { ToolType } from "@prisma/client";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";

export default function UrlParserComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [input, setInput] = useState("");
  const [protocol, setProtocol] = useState("");
  const [host, setHost] = useState("");
  const [path, setPath] = useState("");
  const [query, setQuery] = useState("");
  const [queryJson, setQueryJson] = useState("");

  const debouncedInput = useDebounce(input, 1000);

  useEffect(() => {
    if (debouncedInput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.UrlParser,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedInput]);

  const parseUrl = (text: string) => {
    try {
      const url = new URL(text);
      setProtocol(url.protocol);
      setHost(url.host);
      setPath(url.pathname);
      setQuery(url.search);
      setQueryJson(JSON.stringify(Object.fromEntries(url.searchParams)));
    } catch (e) {
      setProtocol("");
      setHost("");
      setPath("");
      setQuery("");
      setQueryJson("");
    }
  };

  return (
    <div className="w-full h-full flex gap-4">
      <TextArea
        initialInput="https://www.google.com/search?q=youraveragetechbro&oq=youraveragetechbro&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg9MgYIAhBFGDwyBggDEEUYPDIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPNIBCDgwMzRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8"
        onInputChange={(text) => {
          setInput(text);
          parseUrl(text);
        }}
      />

      <div className="w-full h-full flex flex-col gap-4">
        <div>
          <p className="font-bold text-sm mb-2">Protocol</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={protocol}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(protocol);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Host</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
          bg-gray-700 text-white shadow-sm ring-1 ring-inset
          ring-gray-300 focus:ring-2 focus:ring-inset
          focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={host}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(host);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Path</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
          bg-gray-700 text-white shadow-sm ring-1 ring-inset
          ring-gray-300 focus:ring-2 focus:ring-inset
          focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={path}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(path);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Query</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
          bg-gray-700 text-white shadow-sm ring-1 ring-inset
          ring-gray-300 focus:ring-2 focus:ring-inset
          focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={query}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(query);
              }}
            >
              Copy
            </button>
          </div>
        </div>
        {queryJson && (
          <ReadOnlyTextArea
            value={JSON.stringify(JSON.parse(queryJson), null, 2)}
            title="Query JSON"
          />
        )}
      </div>
    </div>
  );
}
