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
    path: "/json-validator",
  },
  {
    name: "String Converter",
    path: "/string-converter",
  },
  {
    name: "Character/Word Counter",
    path: "/character-and-word-counter",
  },
  {
    name: "Unix Time Converter",
    path: "/unix-time-converter",
  },
  {
    name: "Base64 Encoder",
    path: "/base64encoder",
  },
  {
    name: "Url Parser",
    path: "/url-parser",
  },
  {
    name: "Color Converter",
    path: "/color-converter",
  },
  {
    name: "Hash Generator",
    path: "/hash-generator",
  },
  {
    name: "Line Sort And Dedupe",
    path: "/line-sort-and-dedupe",
  },
  {
    name: "Regex Checker",
    path: "/regex-checker",
  },
  {
    name: "Diff Viewer",
    path: "/diff-viewer",
  },
];

export default function ToolList() {
  const pathname = usePathname();
  return (
    <div className="w-72 bg-gray-700 flex flex-col justify-between overflow-y-scroll">
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
