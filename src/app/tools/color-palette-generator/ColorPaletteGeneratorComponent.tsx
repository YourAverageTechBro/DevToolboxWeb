"use client";
import { useEffect, useState } from "react";
import { generate } from "@ant-design/colors";

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState<string>("#b512e2");
  const [lightPalette, setLightPalette] = useState<string[]>([]);
  const [darkPalette, setDarkPalette] = useState<string[]>([]);
  const generatePalettes = () => {
    let lp = generate(baseColor);
    let dP = generate(baseColor, {
      theme: "dark",
      backgroundColor: "#141414",
    });

    setLightPalette(lp);
    setDarkPalette(dP);
  };

  useEffect(() => {
    generatePalettes();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Color Palette Generator</h1>
      <div className="flex items-center gap-2 p-2 border rounded bg-white">
        <label htmlFor="color" className="text-black">
          Input:
        </label>
        <input
          type="color"
          name="color"
          id="color"
          value={baseColor}
          onChange={(e) => {
            setBaseColor(e.target.value);
          }}
        />
        <span className="border text-black px-1 text-sm uppercase">
          {baseColor}
        </span>
        <button
          onClick={generatePalettes}
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm px-2 py-1 ml-auto rounded"
        >
          Generate
        </button>
      </div>

      <div className="p-2 border rounded space-y-4 bg-white">
        <div className="text-center space-y-2 border rounded-md shadow-md py-2">
          <h2 className="text-lg text-black font-semibold">Light Theme</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {lightPalette.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-14 h-14 rounded"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="text-xs text-black uppercase">{color}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="text-center space-y-2 border rounded-md shadow-md py-2"
          style={{ backgroundColor: "#141414" }}
        >
          <h2 className="text-lg font-semibold">Dark Theme</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {darkPalette.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-14 h-14 rounded"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="text-xs uppercase">{color}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
