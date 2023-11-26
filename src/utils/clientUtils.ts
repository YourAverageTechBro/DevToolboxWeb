import { ToolType } from "@prisma/client";
import { User } from "@clerk/backend";

export const saveHistory = async ({
  user,
  toolType,
  metadata,
  onError,
  isProUser,
}: {
  user: User | null;
  toolType: ToolType;
  metadata: Record<string, any>;
  onError: (error: string) => void;
  isProUser: boolean;
}) => {
  if (!isProUser || !user) {
    return;
  }
  const resp = await fetch("/api/history", {
    method: "POST",
    body: JSON.stringify({
      userId: user.id,
      toolType,
      metadata: JSON.stringify(metadata),
    }),
  });
  const data = await resp.json();
  if (data.status === "error") {
    onError("Error saving into your history");
  }
};

export const getApproximateTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days`;
  }
  if (hours > 0) {
    return `${hours} hours`;
  }
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `${seconds} seconds`;
};

export const getPathFromToolType = (toolType: ToolType) => {
  switch (toolType) {
    case ToolType.Base64Encoder:
      return "base64encoder";
    case ToolType.CharacterAndWordCounter:
      return "character-and-word-counter";
    case ToolType.ColorConverter:
      return "color-converter";
    case ToolType.DiffViewer:
      return "diff-viewer";
    case ToolType.HashGenerator:
      return "hash-generator";
    case ToolType.JsonValidator:
      return "json-validator";
    case ToolType.LineSortAndDedupe:
      return "line-sort-and-dedupe";
    case ToolType.RegexChecker:
      return "regex-checker";
    case ToolType.StringConverter:
      return "string-converter";
    case ToolType.UnixTimeConverter:
      return "unix-time-converter";
    case ToolType.UrlParser:
      return "url-parser";
    case ToolType.QrCodeGenerator:
      return "qrcode-generator"
    case ToolType.AsciiConverter:
      return "ascii-converter"
    default:
      return "/";
  }
};
