"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/app/components/common/Button";
import { StarIcon } from "@heroicons/react/24/outline";

export type ToolOption = {
  name: string;
  path: string;
};
export const toolList: ToolOption[] = [
  {
    name: "Diff Viewer",
    path: "/tools/diff-viewer",
  },
  {
    name: "JSON Validator",
    path: "/tools/json-validator",
  },
  {
    name: "Clipboard Formatter",
    path: "/tools/clipboard-formatter",
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
    name: "Base64 Image Encoder",
    path: "/tools/base64imageencoder",
  },
  {
    name: "Url Parser",
    path: "/tools/url-parser",
  },
  {
    name: "Url Encoder",
    path: "/tools/url-encoder",
  },
  {
    name: "Url Decoder",
    path: "/tools/url-decoder",
  },
  {
    name: "Color Converter",
    path: "/tools/color-converter",
  },
  {
    name: "Color Palette Generator",
    path: "/tools/color-palette-generator",
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
    name: "Markdown Editor",
    path: "/tools/markdown-editor",
  },
  {
    name: "QRCode Generator",
    path: "/tools/qrcode-generator",
  },
  {
    name: "ASCII Converter",
    path: "/tools/ascii-converter",
  },
  {
    name: "CSS Unit Converter",
    path: "/tools/css-unit-converter",
  },
  {
    name: "UUID Generator",
    path: "/tools/uuid-generator",
  },
  {
    name: "JWT Viewer",
    path: "/tools/jwt-viewer",
  },
];

export default function ToolList() {
  const pathname = usePathname();
  return (
    <>
      <label
        htmlFor="sidebar-toggle"
        className="bg-indigo-500 md:hidden text-white px-2 py-1 rounded-md hover:bg-indigo-600 cursor-pointer absolute top-2 right-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-menu"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </label>
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />
      <div className="w-0 peer-checked:w-72 md:w-72 bg-gray-700 flex shrink-0 flex-col no-scrollbar overflow-y-scroll transition-all">
        <SignedIn>
          <div className={"px-2 my-4 flex justify-between w-full"}>
            <UserButton afterSignOutUrl="/tools/json-validator" />
            <Button intent={"secondary"} href={"/tools/history"}>
              View History
            </Button>
          </div>
        </SignedIn>
        <SignedOut>
          <div className={"mx-2 my-4 flex flex-col gap-4"}>
            <Button fullWidth intent={"primary"} href={"/sign-in"}>
              Log in / Sign-up
            </Button>
            <p className={"text-xs text-gray-200"}>
              You only have to create an account if you want to upgrade to
              DevToolbox Pro which saves your history so you can keep track of
              all the actions you have done.
            </p>
          </div>
        </SignedOut>
        <Link
          className={`w-full border-y py-3 px-4 hover:bg-gray-600`}
          href={`https://github.com/YourAverageTechBro/DevToolboxWeb`}
          target="_blank"
        >
          <div className={"flex items-center gap-2 "}>
            <StarIcon className={"w-6 h-6"} />
            Star Us On Github
          </div>
        </Link>
        {toolList
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            return 0;
          })
          .map((toolOption) => (
            <Link
              className={`w-full border-b py-3 px-4 hover:bg-gray-600 ${
                pathname === toolOption.path && "bg-gray-500"
              }`}
              key={toolOption.name}
              href={toolOption.path}
            >
              <p> {toolOption.name}</p>
            </Link>
          ))}
      </div>
    </>
  );
}
