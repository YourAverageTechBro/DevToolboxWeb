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
