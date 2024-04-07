"use client";

import { useEffect, useState } from "react";
import FormattedMarkdownOutput from "@/app/components/common/FormattedMarkdownOutput";
import { User } from "@clerk/backend";

export enum EMarkdownStyles {
  Select = "Select",
  Badge = "Badge",
  Blockquote = "Blockquote",
  Code = "Code",
  Emphasis = "Emphasis",
  Emphasis_Italic = "Emphasis_Italic",
  Header_1 = "Header_1",
  Header_2 = "Header_2",
  Header_3 = "Header_3",
  Header_4 = "Header_4",
  Header_5 = "Header_5",
  Header_6 = "Header_6",
  Image = "Image",
  Italic = "Italic",
  List = "List",
  Subscript = "Subscript",
  Superscript = "Superscript",
  Table = "Table",
  Unordered_List = "Unordered_List",
}

export const markdownStyles = [
  { label: "Select a style", value: EMarkdownStyles.Select },
  { label: "Badge", value: EMarkdownStyles.Badge },
  { label: "Blockquote", value: EMarkdownStyles.Blockquote },
  { label: "Code", value: EMarkdownStyles.Code },
  { label: "Emphasis", value: EMarkdownStyles.Emphasis },
  { label: "Emphasis Italic", value: EMarkdownStyles.Emphasis_Italic },
  { label: "Header 1", value: EMarkdownStyles.Header_1 },
  { label: "Header 2", value: EMarkdownStyles.Header_2 },
  { label: "Header 3", value: EMarkdownStyles.Header_3 },
  { label: "Header 4", value: EMarkdownStyles.Header_4 },
  { label: "Header 5", value: EMarkdownStyles.Header_5 },
  { label: "Header 6", value: EMarkdownStyles.Header_6 },
  { label: "Image", value: EMarkdownStyles.Image },
  { label: "Italic", value: EMarkdownStyles.Italic },
  { label: "List", value: EMarkdownStyles.List },
  { label: "Subscript", value: EMarkdownStyles.Subscript },
  { label: "Superscript", value: EMarkdownStyles.Superscript },
  { label: "Table", value: EMarkdownStyles.Table },
  { label: "Unordered List", value: EMarkdownStyles.Unordered_List },
];

const getStyleString = (style: EMarkdownStyles) => {
  let styleString = "\n";
  switch (style) {
    case EMarkdownStyles.Header_1:
    case EMarkdownStyles.Header_2:
    case EMarkdownStyles.Header_3:
    case EMarkdownStyles.Header_4:
    case EMarkdownStyles.Header_5:
    case EMarkdownStyles.Header_6:
      const styleName = style.toString();
      const fontSize = parseInt(styleName.slice(-1));
      styleString += "#".repeat(fontSize) + " Header " + fontSize;
      break;
    case EMarkdownStyles.Badge:
      styleString += `[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)`;
      break;
    case EMarkdownStyles.Blockquote:
      styleString += `> Blockquotes`;
      break;
    case EMarkdownStyles.Code:
      styleString += ` \`\`\`\console.log('hello, world!')\`\`\`\ `;
      break;
    case EMarkdownStyles.Emphasis:
      styleString += `**Emphasis**`;
      break;
    case EMarkdownStyles.Emphasis_Italic:
      styleString += `***Emphasis Italic***`;
      break;
    case EMarkdownStyles.Image:
      styleString += `![](https://i0.wp.com/www.globalemancipation.ngo/wp-content/uploads/2017/09/github-logo.png?ssl=1)`;
      break;
    case EMarkdownStyles.Italic:
      styleString += `*Italic*`;
      break;
    case EMarkdownStyles.List:
      styleString += `1. First ordered list item\n2. Second ordered list item\n3. Third ordered list item`;
      break;
    case EMarkdownStyles.Subscript:
      styleString += `H<sub>2</sub>O`;
      break;
    case EMarkdownStyles.Superscript:
      styleString += `N<sup>2</sup>`;
      break;
    case EMarkdownStyles.Table:
      styleString += `| Feature | Description |
|---|---|
| Headings | Different levels of headings to organize content |
| Paragraphs | Basic text formatting and indentation |
| Lists | Ordered and unordered lists for structured content |
| Links | Internal and external links for navigation |
| Images | Embedding images to enhance visual appeal |
| Code blocks | Highlighting code snippets for programming examples |
| Tables | Presenting data in a structured format |
| Blockquotes | Quoting text or highlighting important points |
| Horizontal rules | Separating sections of content |
| Footnotes | Adding additional information or references |`;
      break;
    case EMarkdownStyles.Unordered_List:
      styleString += `* First unordered list item\n* Second unordered list item\n\t* First subunordered list item\n\t* Second subunordered list item\n* Third unordered list item`;
      break;
    default:
      styleString = "";
  }
  return styleString;
};

export default function JsonValidatorComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState(initialInput);
  const [style, setStyle] = useState(EMarkdownStyles.Select);

  useEffect(() => {
    setOutput(input);
  }, [input]);
  const title = "Input:";

  // const debouncedOutput = useDebounce(output, 1000);
  // useEffect(() => {
  //   if (debouncedOutput && debouncedOutput !== initialInput) {
  //     void saveHistory({
  //       user,
  //       isProUser,
  //       toolType: ToolType.MarkdownEditor,
  //       onError: () => {},
  //       metadata: {
  //         output,
  //       },
  //     });
  //   }
  // }, [debouncedOutput]);

  const onSelect = (option: EMarkdownStyles) => {
    const styleString = getStyleString(option);
    setStyle(option);
    setInput((prev) => prev + styleString);
    setStyle(EMarkdownStyles.Select);
  };

  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4">
          <p className="font-bold text-xl"> {title} </p>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => setInput("")}
          >
            Clear
          </button>

          <div className="flex gap-4 items-center">
            <select
              className={`block w-fit rounded-md border-0 py-1.5 pl-3 pr-10
    text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2
    focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              onChange={(e) => {
                const selectedValue = markdownStyles.find(
                  (value) => value.label === e.target.value
                );
                if (selectedValue) {
                  onSelect(selectedValue.value);
                }
              }}
              value={style}
            >
              {markdownStyles.map((value) => (
                <option key={value.value}>{value.label}</option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
          style={{ height: "calc(100% - 44px)" }}
          value={input}
          onInput={(e) => setInput(e.currentTarget.value)}
        />
      </div>
      <FormattedMarkdownOutput input={output} />
    </div>
  );
}

const initialInput = `# Header
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6
*Italic*      _Italic_
**Emphasis**  __Emphasis__
***Emphasis Italic*** ___Emphasis Italic___
Subscript: X<sub>2</sub>，Superscript: O<sup>2</sup>
> Blockquotes
## Images

![](https://i0.wp.com/www.globalemancipation.ngo/wp-content/uploads/2017/09/github-logo.png?ssl=1)

## Table

| Feature | Description |
|---|---|
| Headings | Different levels of headings to organize content |
| Paragraphs | Basic text formatting and indentation |
| Lists | Ordered and unordered lists for structured content |
| Links | Internal and external links for navigation |
| Images | Embedding images to enhance visual appeal |
| Code blocks | Highlighting code snippets for programming examples |
| Tables | Presenting data in a structured format |
| Blockquotes | Quoting text or highlighting important points |
| Horizontal rules | Separating sections of content |
| Footnotes | Adding additional information or references |

## Code Block
\`\`\`\console.log('hello, world!')\`\`\`\
`;
