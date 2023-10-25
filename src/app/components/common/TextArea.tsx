import { useEffect, useState } from "react";

type Props = {
  // eslint-disable-next-line react/require-default-props
  initialInput?: string;
  onInputChange: (input: string) => void;
  // eslint-disable-next-line react/require-default-props
  title?: string;
};
export default function TextArea({
  initialInput = "",
  onInputChange,
  title = "Input:",
}: Props) {
  const [input, setInput] = useState(initialInput);

  useEffect(() => {
    onInputChange(input);
  }, [input, onInputChange]);

  return (
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
  );
}
