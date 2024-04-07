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

  const [removeSpaces, setRemoveSpaces] = React.useState(false);
  const [removeTabs, setRemoveTabs] = React.useState(false);
  const [removeNewLines, setRemoveNewLines] = React.useState(false);
  const [indentToShortest, setIndentToShortest] = React.useState(false);
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

    if (indentToShortest) {
      const lines = formattedText.split("\n");

      // Find the line with the smallest number of spaces and tabs
      let minIndent = Infinity;
      for (const line of lines) {
        const indent = line.search(/\S/);
        if (indent !== -1 && indent < minIndent) {
          minIndent = indent;
        }
      }

      // Remove the found amount of indentation from all lines
      formattedText = lines
        .map((line) => {
          if (line.length >= minIndent) {
            return line.substring(minIndent);
          }
          return line;
        })
        .join("\n");
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
    indentToShortest,
  ]);

  const initialInput = `
            Hello world (spaces)
\t\t\thello World tabbed
            hello! wolrds @#$ 123
            hello hell help hello

        if(1+1===2){
            console.log("hello")
        }
`;

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex gap-4 h-1/2">
          <TextArea
            initialInput={initialInput}
            title="Original:"
            onInputChange={(input) => setOriginalText(input)}
          />

          <ReadOnlyTextArea value={formattedText} />
        </div>

        <div className="flex gap-4 flex-col mt-10">
          <p className="text-lg font-bold">Options:</p>
          <label>
            <input
              type="checkbox"
              className="border-gray-300 rounded h-4 w-4"
              onChange={(e) => {
                setRemoveTabs(e.target.checked);
              }}
            />
            <span className="pl-2">Remove tabs</span>
          </label>
          <label>
            <input
              type="checkbox"
              className="border-gray-300 rounded h-4 w-4"
              onChange={(e) => {
                setRemoveSpaces(e.target.checked);
              }}
            />
            <span className="pl-2">Remove spaces</span>
          </label>
          <label>
            <input
              type="checkbox"
              className="border-gray-300 rounded h-4 w-4"
              onChange={(e) => {
                setRemoveNewLines(e.target.checked);
              }}
            />
            <span className="pl-2">Remove new lines</span>
          </label>

          <label>
            <input
              type="checkbox"
              className="border-gray-300 rounded h-4 w-4"
              onChange={(e) => {
                setIndentToShortest(e.target.checked);
              }}
            />
            <span className="pl-2">
              Indent to shortest line (Code formatting)
            </span>
          </label>
          <label>
            <input
              type="checkbox"
              className="border-gray-300 rounded h-4 w-4"
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
              className="border-gray-300 rounded h-4 w-4"
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
              className="border-gray-300 rounded h-4 w-4"
              onChange={(e) => {
                setRemoveSpecificWords(e.target.checked);
              }}
            />
            <span className="pl-2">
              Remove specific words (Comma seperated)
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
                className="border-gray-300 rounded h-4 w-4 ml-4 mt-4"
                onChange={(e) => {
                  setRemoveSpecificWordsPartial(e.target.checked);
                  if (e.target.checked) {
                    setRemoveSpecificWords(true);
                  }
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
