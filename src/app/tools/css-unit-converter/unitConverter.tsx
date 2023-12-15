"use client";

import { findNearestNumber } from "@/utils/findNearestNumber";
import {
  useState,
  type FC,
  ChangeEvent,
  useEffect,
  CSSProperties,
} from "react";

const UnitInput: FC<{
  name: string;
  onChange: (input: number | null, isDisabled: boolean) => any;
  value: number;
}> = (props) => {
  const [value, setValue] = useState<null | number>(0);
  const [isDisabled, setDisabled] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    const realNum = isNaN(num) ? null : num;
    setValue(realNum);
    setDisabled(isNaN(num));
    props.onChange(realNum, isNaN(num));
  };

  useEffect(() => {
    setValue(props.value);
    setDisabled(isNaN(props.value));
  }, [props.value]);

  return (
    <div>
      <p className="font-bold text-sm mb-2 capitalize">{props.name}</p>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={`${value ?? ""}`}
          onChange={handleInput}
          className="px-4 py-2 w-full block rounded-lg border-0
			bg-gray-700 text-white shadow-sm ring-1 ring-inset
			ring-gray-300 focus:ring-2 focus:ring-inset
			focus:ring-indigo-600 sm:text-sm sm:leading-6
			[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm
			  font-semibold text-white shadow-sm enabled:hover:bg-indigo-400 focus-visible:outline
			  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
			  disabled:opacity-80 disabled:cursor-not-allowed"
          onClick={() => {
            navigator.clipboard.writeText(`${value}`);
          }}
          disabled={isDisabled}
        >
          Copy
        </button>
      </div>
    </div>
  );
};

const tailwindUnits = [
  0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 20, 24,
  28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
];

const emToPx = (em: number) => em * 16;
const twToPx = (tw: number) => tw * 4;

const pxToEm = (px: number) => px / 16;
const pxToTw = (px: number) => findNearestNumber(tailwindUnits, px / 4) ?? 0;

const UnitConverter = () => {
  const [em, setEm] = useState(0);
  const [px, setPx] = useState(0);
  const [tw, setTw] = useState(0);

  const [style, setStyle] = useState({ "--w": `${px}px` } as CSSProperties);

  useEffect(() => {
    setEm(pxToEm(px));
    setTw(pxToTw(px));

    setStyle({ "--w": `${px}px` } as CSSProperties);
  }, [px]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <UnitInput
          name="em"
          value={em}
          onChange={(n, d) => {
            if (!d && n !== null) {
              setPx(emToPx(n));
            }
          }}
        />
        <UnitInput
          name="px"
          value={px}
          onChange={(n, d) => {
            if (!d && n !== null) {
              setPx(n);
            }
          }}
        />
        <UnitInput
          name="Tailwind"
          value={tw}
          onChange={(n, d) => {
            if (!d && n !== null) {
              setPx(twToPx(n));
            }
          }}
        />
      </div>

      <div className="px-1 py-4">
        <div
          style={style}
          className="w-full h-[var(--w)] bg-indigo-500
			flex items-center justify-center
			rounded-md"
        >
          This is {px} Pixel high
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
