"use client";

import { useEffect, useState } from "react";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

export default function ColorConverterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [rgb, setRgb] = useState("255, 255, 255");
  const [rgba, setRgba] = useState("255, 255, 255, 1");
  const [hex, setHex] = useState("#ffffff");

  const debouncedRgb = useDebounce<string>(rgb, 1000);
  const debouncedRgba = useDebounce<string>(rgba, 1000);
  const debouncedHex = useDebounce<string>(hex, 1000);

  useEffect(() => {
    if (debouncedRgb && debouncedHex && debouncedRgba) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.ColorConverter,
        onError: () => {},
        metadata: {
          rgb,
          rgba,
          hex,
        },
      });
    }
  }, [debouncedRgb, debouncedHex, debouncedRgba]);

  const rgbToHex = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedRgb = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., 'rgb(255, 0, 0) or (255,0,0)')
    const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+)\)?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error();
    }

    // Convert the RGB values to hexadecimal and pad with zeros if needed
    const toHex = (value: number) => {
      const hex = value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);

    return `#${hexR}${hexG}${hexB}`;
  };

  const rgbToRgba = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedRgb = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., 'rgb(255, 0, 0) or (255,0,0)')
    const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+)\)?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error();
    }

    return `${r}, ${g}, ${b}, 1`;
  }
  
  const hexToRgb = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedHex = input.replace(/\s/g, "").toLowerCase();
    
    // Check if the input is in the correct format (e.g., '#ff0000' or 'ff0000')
    const match = cleanedHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    
    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error();
    }
    
    return `${r}, ${g}, ${b}`;
  };

  const hexToRgba = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedHex = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., '#ff0000' or 'ff0000')
    const match = cleanedHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    const a = match[4] === undefined ? 1 : parseInt(match[4], 16)/255;
    
    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1 ) {
      throw Error();
    }
    
    return `${r}, ${g}, ${b}, ${a % 1 === 0 ? a : a.toFixed(3)}`;
  }

  const rgbaToRgb = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedRgb = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., 'rgb(255, 0, 0, 1) or (255,0,0,1)')
    const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+),(\d+(\.\d+)?)\)?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error();
    }

    return `${r}, ${g}, ${b}`;
  }

  const rgbaToHex = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedRgb = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., 'rgb(255, 0, 0) or (255,0,0)')
    const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+),(\d+(\.\d+)?)\)?$/);

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = parseFloat(match[4]);

    // Ensure that RGB values are in the valid range [0, 255]
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
      throw Error();
    }

    // Convert the RGB values to hexadecimal and pad with zeros if needed
    const toHex = (value: number) => {
      const hex = value.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);
    const hexA = toHex(parseInt((a * 255).toFixed(0)));

    return `#${hexR}${hexG}${hexB}${hexA}`;
  }

  const handleRgbChange = (input: string) => {
    try {
      setRgb(input);
      setRgba(rgbToRgba(input));
      setHex(rgbToHex(input));
    } catch (_) {
      setHex("");
      setRgba("");
    }
  };

  const handleHexChange = (input: string) => {
    try {
      setHex(input);
      setRgb(hexToRgb(input));
      setRgba(hexToRgba(input));
    } catch (_) {
      setRgb("");
      setRgba("");
    }
  };

  const handleRgbaChange = (input: string) => {
    try {
      setRgba(input);
      setRgb(rgbaToRgb(input));
      setHex(rgbaToHex(input));
    } catch (_) {
      setRgb("");
      setHex("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div>
        <p className="font-bold text-sm mb-2"> RGB: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={rgb}
            onChange={(e) => handleRgbChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(rgb);
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold text-sm mb-2"> RGBA: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={rgba}
            onChange={(e) => handleRgbaChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(rgba);
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold text-sm mb-2"> Hex: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={hex}
            onChange={(e) => handleHexChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(hex);
            }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
