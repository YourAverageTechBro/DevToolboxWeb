"use client";

import * as CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import TextArea from "@/app/components/common/TextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { ToolType } from "@prisma/client";
import { saveHistory } from "@/utils/clientUtils";

export default function HashGeneratorComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [input, setInput] = useState("");
  const [md5Hash, setMd5Hash] = useState("");
  const [sha1Hash, setSha1Hash] = useState("");
  const [sha224Hash, setSha224Hash] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [sha384Hash, setSha384Hash] = useState("");
  const [sha512Hash, setSha512Hash] = useState("");
  const [keccak256Hash, setKeccak256Hash] = useState("");

  const debouncedInput = useDebounce<string>(input, 1000);

  useEffect(() => {
    if (debouncedInput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.HashGenerator,
        onError: () => {},
        metadata: {
          debouncedInput,
        },
      });
    }
  }, [debouncedInput]);

  const generateMd5Hash = (input: string) =>
    setMd5Hash(CryptoJS.MD5(input).toString());
  const generateSha1Hash = (input: string) =>
    setSha1Hash(CryptoJS.SHA1(input).toString());
  const generateSha224Hash = (input: string) =>
    setSha224Hash(CryptoJS.SHA224(input).toString());

  const generateSha256Hash = (input: string) =>
    setSha256Hash(CryptoJS.SHA256(input).toString());

  const generateSha384Hash = (input: string) =>
    setSha384Hash(CryptoJS.SHA384(input).toString());

  const generateSha512Hash = (input: string) =>
    setSha512Hash(CryptoJS.SHA512(input).toString());

  const generateKeccak256Hash = (input: string) =>
    setKeccak256Hash(CryptoJS.SHA3(input, { outputLength: 256 }).toString());

  const generateHashes = (input: string) => {
    try {
      if (input) {
        generateMd5Hash(input);
        generateSha1Hash(input);
        generateSha224Hash(input);
        generateSha256Hash(input);
        generateSha384Hash(input);
        generateSha512Hash(input);
        generateKeccak256Hash(input);
      }
    } catch (_) {
      generateMd5Hash("");
      generateSha1Hash("");
      generateSha224Hash("");
      generateSha256Hash("");
      generateSha384Hash("");
      generateSha512Hash("");
      generateKeccak256Hash("");
    }
  };

  return (
    <div className="w-full h-full flex gap-4">
      <TextArea
        initialInput="hello world"
        onInputChange={(input) => {
          setInput(input);
          generateHashes(input);
        }}
      />

      <div className="w-full h-full flex flex-col gap-4">
        <div>
          <p className="font-bold text-sm mb-2">Md5 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={md5Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(md5Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Sha1 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sha1Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(sha1Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Sha224 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sha224Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(sha224Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Sha256 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sha256Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(sha256Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Sha384 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sha384Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(sha384Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Sha512 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sha512Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(sha512Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-2">Keccak256 Hash:</p>
          <div className="flex gap-2">
            <input
              readOnly
              className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={keccak256Hash}
            />
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={async () => {
                await navigator.clipboard.writeText(keccak256Hash);
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
