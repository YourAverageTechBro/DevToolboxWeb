"use client";

import { useState } from "react";
import TextArea from "@/app/components/common/TextArea";
import FormattedJsonOutput from "@/app/components/common/FormatedJsonOutput";

export default function JsonValidatorComponent() {
  const [output, setOutput] = useState("");
  return (
    <div className="w-full h-full flex gap-4">
      <TextArea
        initialInput={initialInput}
        onInputChange={(input) => setOutput(input)}
      />
      <FormattedJsonOutput value={output} />
    </div>
  );
}

const initialInput =
  "{\n" +
  '    "store": {\n' +
  '        "book": [\n' +
  "            {\n" +
  '                "category": "reference",\n' +
  '                "author": "Nigel Rees",\n' +
  '                "title": "Sayings of the Century",\n' +
  '                "price": 8.95\n' +
  "            },\n" +
  "            {\n" +
  '                "category": "fiction",\n' +
  '                "author": "Evelyn Waugh",\n' +
  '                "title": "Sword of Honour",\n' +
  '                "price": 12.99\n' +
  "            },\n" +
  "            {\n" +
  '                "category": "fiction",\n' +
  '                "author": "Herman Melville",\n' +
  '                "title": "Moby Dick",\n' +
  '                "isbn": "0-553-21311-3",\n' +
  '                "price": 8.99\n' +
  "            },\n" +
  "            {\n" +
  '                "category": "fiction",\n' +
  '                "author": "J. R. R. Tolkien",\n' +
  '                "title": "The Lord of the Rings",\n' +
  '                "isbn": "0-395-19395-8",\n' +
  '                "price": 22.99\n' +
  "            }\n" +
  "        ],\n" +
  '        "bicycle": {\n' +
  '            "color": "red",\n' +
  '            "price": 19.95\n' +
  "        }\n" +
  "    },\n" +
  '    "expensive": 10\n' +
  "}";
