"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";

export default function UuidGeneratorComponent() {
const [uuid, _] = useState(uuidv4());
  return (
      <div className="w-full flex gap-4">
        <ReadOnlyTextArea
            value={uuid}
            title="UUIDv4"
        />
      </div>
  );
}
