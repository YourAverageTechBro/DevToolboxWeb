"use client";

import React, { useEffect } from "react";

import TextArea from "@/app/components/common/TextArea";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { ToolType } from "@prisma/client";
import { saveHistory } from "@/utils/clientUtils";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";

export default function ClipFormatterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [originalText, setOriginalText] = React.useState("");
  const [formattedText, setFormattedText] = React.useState("");

  const optionList = [
    {
      name: "Remove tabs",
      value: "removeTabs",
    },
    {
      name: "Remove spaces",
      value: "removeSpaces",
    },
    {
      name: "Remove new lines",
      value: "removeNewLines",
    },
    {
      name: "Remove spaces before first word in a line",
      value: "removeSpacesBeforeFirstWord",
    },
    {
      name: "Remove specific characters",
      value: "removeSpecificCharacters",
    },
    {
      name: "Remove specific words",
      value: "removeSpecificWords",
    },
  ];
  const [removeSpaces, setRemoveSpaces] = React.useState(false);
  const [removeTabs, setRemoveTabs] = React.useState(false);
  const [removeNewLines, setRemoveNewLines] = React.useState(false);
  const [removeSpacesBeforeFirstWord, setRemoveSpaceBeforeFirstWord] =
    React.useState(false);
  const [removeSpecificCharacters, setRemoveSpecificCharacters] =
    React.useState(false);
  const [removeSpecificCharactersList, setRemoveSpecificCharactersList] =
    React.useState<string[]>([]);
  const [removeSpecificWords, setRemoveSpecificWords] = React.useState(false);
  const [removeSpecificWordsPartial, setRemoveSpecificWordsPartial] =
    React.useState(false);
  const [removeSpecificWordsList, setRemoveSpecificWordsList] = React.useState<
    string[]
  >([]);

  const debouncedOriginalText = useDebounce<string>(originalText, 1000);

  useEffect(() => {
    if (debouncedOriginalText) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.DiffViewer,
        onError: () => {},
        metadata: {
          originalText,
        },
      });
    }
  }, [debouncedOriginalText]);

  useEffect(() => {
    let formattedText = originalText;

    if (removeTabs) {
      formattedText = formattedText.replace(/\t/g, "");
    }

    if (removeSpaces) {
      formattedText = formattedText.replace(/ /g, "");
    }

    if (removeNewLines) {
      formattedText = formattedText.replace(/\n/g, "");
    }

    if (removeSpacesBeforeFirstWord) {
      formattedText = formattedText.replace(/^[ ]+/gm, "");
    }

    if (removeSpecificCharacters && removeSpecificCharactersList.length > 0) {
      formattedText = formattedText.replace(
        new RegExp(`[${removeSpecificCharactersList.join("")}]`, "g"),
        ""
      );
    }

    if (removeSpecificWords && removeSpecificWordsList.length > 0) {
      // formattedText = formattedText.replace(
      //   new RegExp(`\\b(${removeSpecificWordsList.join("|")})\\b`, "g"),
      //   ""
      // );

      if (removeSpecificWordsPartial) {
        // matches removeSpecificWordsList even if it is a part of a word
        formattedText = formattedText.replace(
          new RegExp(`\\b(${removeSpecificWordsList.join("|")})`, "g"),
          ""
        );
      } else {
        formattedText = formattedText.replace(
          new RegExp(`\\b(${removeSpecificWordsList.join("|")})\\b`, "g"),
          ""
        );
      }
    }

    setFormattedText(formattedText);
  }, [
    originalText,
    removeTabs,
    removeSpaces,
    removeNewLines,
    removeSpacesBeforeFirstWord,
    removeSpecificCharacters,
    removeSpecificCharactersList,
    removeSpecificWords,
    removeSpecificWordsList,
    removeSpecificWordsPartial,
  ]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex gap-4 h-1/2">
          <TextArea
            initialInput="hello world"
            title="Original:"
            onInputChange={(input) => setOriginalText(input)}
          />

          <ReadOnlyTextArea value={formattedText} />
        </div>

        {/* <div className="flex gap-4 flex-col mt-10">
          <p className="text-lg font-bold">Options:</p>
          {optionList.map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (option.value === "removeTabs") {
                    setRemoveTabs(e.target.checked);
                  } else if (option.value === "removeSpaces") {
                    setRemoveSpaces(e.target.checked);
                  } else if (option.value === "removeNewLines") {
                    setRemoveNewLines(e.target.checked);
                  } else if (option.value === "removeSpacesBeforeFirstWord") {
                    setRemoveSpaceBeforeFirstWord(e.target.checked);
                  }
                }}
              />
              <span className="pl-2">
                {option.name}{" "}
                {option.value === "removeSpecificCharacters" && (
                  <>
                    <span> (Seperate by spaces)</span>

                    <input
                      className="px-4 py-2 ml-4 rounded-lg border-0
                    bg-gray-700 text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      placeholder="Characters to remove"
                      onChange={(e) => {
                        setRemoveSpecificCharacters(e.target.value);
                      }}
                    />
                  </>
                )}
              </span>
            </label>
          ))}
        </div> */}

        {/* make a non-looping component for the checkboxes */}
        <div className="flex gap-4 flex-col mt-10">
          <p className="text-lg font-bold">Options:</p>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                setRemoveTabs(e.target.checked);
              }}
            />
            <span className="pl-2">Remove tabs</span>
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                setRemoveSpaces(e.target.checked);
              }}
            />
            <span className="pl-2">Remove spaces</span>
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                setRemoveNewLines(e.target.checked);
              }}
            />
            <span className="pl-2">Remove new lines</span>
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                setRemoveSpaceBeforeFirstWord(e.target.checked);
              }}
            />
            <span className="pl-2">
              Remove spaces before first word in a line
            </span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={removeSpecificCharacters}
              onChange={(e) => {
                setRemoveSpecificCharacters(e.target.checked);
              }}
            />
            <span className="pl-2">Remove specific characters</span>
            <div className="flex">
              <input
                className="px-4 py-2 ml-8 mt-4 rounded-lg border-0 w-1/2
              bg-gray-700 text-white shadow-sm ring-1 ring-inset
              ring-gray-300 focus:ring-2 focus:ring-inset
            focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                placeholder="Characters to remove (except space)"
                onChange={(e) => {
                  setRemoveSpecificCharactersList(
                    e.target.value.split("").filter((char) => char !== " ")
                  );
                  setRemoveSpecificCharacters(true);
                }}
              />
            </div>
          </label>

          <label>
            <input
              type="checkbox"
              checked={removeSpecificWords}
              onChange={(e) => {
                setRemoveSpecificWords(e.target.checked);
              }}
            />
            <span className="pl-2">
              Remove specific words (Comma seperated, except space)
            </span>
            <div className="flex flex-row items-center">
              <input
                className="px-4 py-2 ml-8 mt-4 rounded-lg border-0 w-1/2
            bg-gray-700 text-white shadow-sm ring-1 ring-inset
            ring-gray-300 focus:ring-2 focus:ring-inset
            focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                placeholder="Characters to remove (except space)"
                onChange={(e) => {
                  setRemoveSpecificWordsList(
                    e.target.value.split(",").map((word) => word.trim())
                  );
                  setRemoveSpecificWords(true);
                }}
              />

              <input
                type="checkbox"
                className="ml-4 mt-4"
                onChange={(e) => {
                  setRemoveSpecificWordsPartial(e.target.checked);
                }}
              />
              <span className="ml-4 mt-4">Partial match</span>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}
