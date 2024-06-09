"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/app/components/common/Button";
import {
  StarIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export type ToolOption = {
  name: string;
  shortenedName: string;
  path: string;
};

export const toolList: ToolOption[] = [
  {
    name: "Diff Viewer",
    shortenedName: "Diff View",
    path: "/tools/diff-viewer",
  },
  {
    name: "JSON Validator",
    shortenedName: "JSON Valid",
    path: "/tools/json-validator",
  },
  {
    name: "Clipboard Formatter",
    shortenedName: "Clip For",
    path: "/tools/clipboard-formatter",
  },
  {
    name: "String Converter",
    shortenedName: "Str Conv",
    path: "/tools/string-converter",
  },
  {
    name: "Character Counter",
    shortenedName: "Char Count",
    path: "/tools/character-and-word-counter",
  },
  {
    name: "Unix Time Converter",
    shortenedName: "Unix Conv",
    path: "/tools/unix-time-converter",
  },
  {
    name: "Base64 Encoder",
    shortenedName: "B64 En",
    path: "/tools/base64encoder",
  },
  {
    name: "Base64 Image Encoder",
    shortenedName: "B64 Im En",
    path: "/tools/base64imageencoder",
  },
  {
    name: "Url Parser",
    shortenedName: "Url Par",
    path: "/tools/url-parser",
  },
  {
    name: "Url Encoder",
    shortenedName: "Url En",
    path: "/tools/url-encoder",
  },
  {
    name: "Url Decoder",
    shortenedName: "Url De",
    path: "/tools/url-decoder",
  },
  {
    name: "Color Converter",
    shortenedName: "Color Conv",
    path: "/tools/color-converter",
  },
  {
    name: "Hash Generator",
    shortenedName: "Hash Gen",
    path: "/tools/hash-generator",
  },
  {
    name: "Line Sort And Dedupe",
    shortenedName: "Line Sort",
    path: "/tools/line-sort-and-dedupe",
  },
  {
    name: "Regex Checker",
    shortenedName: "Regex Che",
    path: "/tools/regex-checker",
  },
  {
    name: "Markdown Editor",
    shortenedName: "Mark Edit",
    path: "/tools/markdown-editor",
  },
  {
    name: "QRCode Generator",
    shortenedName: "QRCode Gen",
    path: "/tools/qrcode-generator",
  },
  {
    name: "ASCII Converter",
    shortenedName: "ASCII Conv",
    path: "/tools/ascii-converter",
  },
  {
    name: "CSS Unit Converter",
    shortenedName: "CSS Conv",
    path: "/tools/css-unit-converter",
  },
  {
    name: "UUID Generator",
    shortenedName: "UUID Gen",
    path: "/tools/uuid-generator",
  },
  {
    name: "JWT Viewer",
    shortenedName: "JWT View",
    path: "/tools/jwt-viewer",
  },
];

const Tooltip = ({ text, children }: { text: string; children: ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center group">
      <div className="absolute bottom-[50%] mb-2 hidden w-min rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
        {text}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default function ToolList() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);
  const collapsedMenu = (
    <div className={`m-5 flex flex-col gap-4 w-max justify-center`}>
      <Button href={"/sign-in"}>
        <UserCircleIcon className={"w-6 h-6"} />
      </Button>
      <Button onClick={toggle}>
        <ListBulletIcon className={"w-6 h-6"} />
      </Button>
    </div>
  );
  const fullWidthMenu = (
    <div className={`m-4 flex flex-row justify-evenly gap-4`}>
      <Button intent={"primary"} href={"/sign-in"}>
        Log in / Sign-up
      </Button>
      <Button onClick={toggle}>
        <ArrowLeftIcon className={"w-6 h-6"} />
      </Button>
    </div>
  );

  return (
    <div
      className={`${
        collapsed ? "w-25" : "w-72"
      } bg-gray-700 flex shrink-0 flex-col overflow-y-scroll scroll-py-6`}
    >
      <SignedIn>
        <div className={"px-2 my-4 flex justify-between w-full"}>
          <UserButton afterSignOutUrl="/tools/json-validator" />
          <Button intent={"secondary"} href={"/tools/history"}>
            View History
          </Button>
        </div>
      </SignedIn>
      <SignedOut>
        {collapsed ? collapsedMenu : fullWidthMenu}
        {!collapsed && (
          <p className={"text-xs text-gray-200"}>
            {" "}
            You only have to create an account if you want to upgrade to
            DevToolbox Pro which saves your history so you can keep track of all
            the actions you have done.
          </p>
        )}
      </SignedOut>
      {!collapsed && (
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
      )}
      {toolList
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;
          return 0;
        })
        .map((toolOption) => (
          <Link
            className={`w-full border-b py-3 px-2 hover:bg-gray-600 ${
              pathname === toolOption.path && "bg-gray-500"
            }`}
            key={toolOption.name}
            href={toolOption.path}
          >
            {collapsed ? (
              <Tooltip text={toolOption.name}>
                <p>{toolOption.shortenedName}</p>
              </Tooltip>
            ) : (
              <p>{toolOption.name}</p>
            )}
          </Link>
        ))}
    </div>
  );
}
