import ColorPaletteGeneratorComponent from "./ColorPaletteGeneratorComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Toolbox - Color Palette Generator",
  description:
    "Light and Dark theme color palette generator. Powered by @ant-designs/color.",
  keywords: ["color", "palette", "generator", "light", "dark"],
  openGraph: {
    title: "Dev Toolbox - Color Palette Generator",
    description:
      "Light and Dark theme color palette generator. Powered by @ant-designs/color.",
  },
};
const ColorPaletteGenerator = () => {
  return <ColorPaletteGeneratorComponent />;
};
export default ColorPaletteGenerator;
