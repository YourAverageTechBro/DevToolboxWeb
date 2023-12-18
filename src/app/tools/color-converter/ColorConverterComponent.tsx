"use client";

import { useEffect, useState } from "react";
import { User } from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";

const isHSLColor =
  /^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/i;

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
  const [hsl, setHsl] = useState("hsl(0, 0%, 100%)");

  const debouncedRgb = useDebounce<string>(rgb, 1000);
  const debouncedRgba = useDebounce<string>(rgba, 1000);
  const debouncedHex = useDebounce<string>(hex, 1000);
  const debouncedHsl = useDebounce<string>(hsl, 1000);

  useEffect(() => {
    if (debouncedRgb && debouncedHex && debouncedRgba && debouncedHsl) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.ColorConverter,
        onError: () => {},
        metadata: {
          rgb,
          rgba,
          hex,
          hsl,
        },
      });
    }
  }, [debouncedRgb, debouncedHex, debouncedRgba, debouncedHsl]);

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
  };

  const hexToRgb = (input: string): string => {
    // Remove any spaces and convert to lowercase
    const cleanedHex = input.replace(/\s/g, "").toLowerCase();

    // Check if the input is in the correct format (e.g., '#ff0000' or 'ff0000')
    const match = cleanedHex.match(
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/
    );

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
    const match = cleanedHex.match(
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/
    );

    if (!match) {
      throw Error();
    }

    // Extract the RGB values
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    const a = match[4] === undefined ? 1 : parseInt(match[4], 16) / 255;

    // Ensure that RGB values are in the valid range [0, 255]
    if (
      r < 0 ||
      r > 255 ||
      g < 0 ||
      g > 255 ||
      b < 0 ||
      b > 255 ||
      a < 0 ||
      a > 1
    ) {
      throw Error();
    }

    return `${r}, ${g}, ${b}, ${a % 1 === 0 ? a : a.toFixed(3)}`;
  };

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
  };

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
    if (
      r < 0 ||
      r > 255 ||
      g < 0 ||
      g > 255 ||
      b < 0 ||
      b > 255 ||
      a < 0 ||
      a > 1
    ) {
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
  };

  const hexToHsl = (input: string): string => {
    // Convert hex to RGB first
    let r: any = 0,
      g: any = 0,
      b: any = 0;

    if (input.length == 4) {
      r = "0x" + input[1] + input[1];
      g = "0x" + input[2] + input[2];
      b = "0x" + input[3] + input[3];
    } else if (input.length == 7) {
      r = "0x" + input[1] + input[2];
      g = "0x" + input[3] + input[4];
      b = "0x" + input[5] + input[6];
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  };

  const hslToRgb = (input: string): string => {
    // get HSL values from input
    let sep = input.indexOf(",") > -1 ? "," : " ";
    const hsl = input.substring(4).split(")")[0].split(sep);

    let h: any = hsl[0],
      s: any = hsl[1].substring(0, hsl[1].length - 1),
      l: any = hsl[2].substring(0, hsl[2].length - 1);

    // Keep hue fraction of 360 if ending up over
    if (h >= 360) h %= 360;
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return r + ", " + g + ", " + b;
  };

  const handleRgbChange = (input: string) => {
    try {
      setRgb(input);
      setRgba(rgbToRgba(input));
      setHex(rgbToHex(input));
      setHsl(hexToHsl(rgbToHex(input)));
    } catch (_) {
      setHex("");
      setRgba("");
      setHsl("");
    }
  };

  const handleHexChange = (input: string) => {
    try {
      setHex(input);
      setRgb(hexToRgb(input));
      setRgba(hexToRgba(input));
      setHsl(hexToHsl(input));
    } catch (_) {
      setRgb("");
      setRgba("");
      setHsl("");
    }
  };

  const handleRgbaChange = (input: string) => {
    try {
      setRgba(input);
      setRgb(rgbaToRgb(input));
      setHex(rgbaToHex(input));
      setHsl(hexToHsl(rgbaToHex(input)));
    } catch (_) {
      setRgb("");
      setHex("");
      setHsl("");
    }
  };

  const handleHslChange = (input: string) => {
    setHsl(input);
    if (!isHSLColor.test(input)) {
      setRgb("");
      setHex("");
      setRgba("");
    } else {
      try {
        setRgb(hslToRgb(input));
        setRgba(rgbToRgba(hslToRgb(input)));
        setHex(rgbToHex(hslToRgb(input)));
      } catch (_) {
        setRgb("");
        setHex("");
        setRgba("");
      }
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

      <div>
        <p className="font-bold text-sm mb-2"> HSL: </p>
        <div className="flex gap-2">
          <input
            className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={hsl}
            onChange={(e) => handleHslChange(e.currentTarget.value)}
          />
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={async () => {
              await navigator.clipboard.writeText(hsl);
            }}
          >
            Copy
          </button>
        </div>
      </div>
      <p className="font-bold text-sm mb-2">Preview:</p>
      <svg width={200} height={200}>
        <rect width="100%" height="100%" fill={"rgba(" + rgba + ")"}></rect>
      </svg>
    </div>
  );
}
