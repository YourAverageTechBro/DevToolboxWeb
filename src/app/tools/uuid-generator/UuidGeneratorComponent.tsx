"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";

export default function UuidGeneratorComponent() {
const [uuid, setUuid] = useState(uuidv4());
const generateNewAndCopy = () => {
  const newUuid = uuidv4();
  setUuid(newUuid);
  navigator.clipboard.writeText(newUuid);
}
  return (
      <div className="w-full flex flex-col gap-4">
        <ReadOnlyTextArea
            value={uuid}
            title="UUIDv4"
        />
        <button
          type="button"
          className="h-11 rounded-md mt-4 bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={generateNewAndCopy}>
        Generate & Copy
        </button>
      </div>
  );
}
