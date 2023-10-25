"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type ToolOption = {
  name: string;
  path: string;
};
export const toolList: ToolOption[] = [
  {
    name: "JSON Validator",
    path: "/tools/json-validator",
  },
  {
    name: "String Converter",
    path: "/tools/string-converter",
  },
  {
    name: "Character/Word Counter",
    path: "/tools/character-and-word-counter",
  },
  {
    name: "Unix Time Converter",
    path: "/tools/unix-time-converter",
  },
  {
    name: "Base64 Encoder",
    path: "/tools/base64encoder",
  },
  {
    name: "Url Parser",
    path: "/tools/url-parser",
  },
  {
    name: "Color Converter",
    path: "/tools/color-converter",
  },
  {
    name: "Hash Generator",
    path: "/tools/hash-generator",
  },
  {
    name: "Line Sort And Dedupe",
    path: "/tools/line-sort-and-dedupe",
  },
  {
    name: "Regex Checker",
    path: "/tools/regex-checker",
  },
  {
    name: "Diff Viewer",
    path: "/tools/diff-viewer",
  },
];

export default function ToolList() {
  const pathname = usePathname();
  return (
    <div className="w-72 bg-gray-700 flex flex-col overflow-y-scroll">
      {toolList.map((toolOption) => (
        <Link
          className={`w-full border-b p-4 hover:bg-gray-600 ${
            pathname === toolOption.path && "bg-gray-500"
          }`}
          key={toolOption.name}
          href={toolOption.path}
        >
          <p> {toolOption.name}</p>
        </Link>
      ))}
    </div>
  );
}
