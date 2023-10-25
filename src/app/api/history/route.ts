import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ToolType } from "@prisma/client";
import prisma from "@/db/prisma";

const postRequestValidator = z.object({
  toolType: z.nativeEnum(ToolType),
  metadata: z.string(),
  userId: z.string(),
});
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { userId, toolType, metadata } = postRequestValidator.parse(body);
    const parsedMetadata = JSON.parse(metadata);
    await prisma.history.create({
      data: {
        userId,
        toolType,
        metadata: parsedMetadata,
      },
    });
    return NextResponse.json(
      { status: "success", message: "Successfully saved history" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid request body" },
      { status: 422 }
    );
  }
};
