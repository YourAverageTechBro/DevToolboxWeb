import { ToolType } from "@prisma/client";

export const saveHistory = async (
  userId: string,
  toolType: ToolType,
  metadata: Record<string, any>,
  onError: (error: string) => void
) => {
  const resp = await fetch("/api/history", {
    method: "POST",
    body: JSON.stringify({
      userId,
      toolType,
      metadata: JSON.stringify(metadata),
    }),
  });
  const data = await resp.json();
  if (data.status === "error") {
    onError("Error saving into your history");
  }
};
