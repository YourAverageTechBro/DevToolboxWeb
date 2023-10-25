"use server";

import prisma from "@/db/prisma";
import { currentUser } from "@clerk/nextjs";

export const getUserAndSubscriptionState = async () => {
  const user = await currentUser();
  let isProUser = false;
  if (user) {
    const subscriptions = await prisma.subscriptions.findMany({
      where: {
        clerkUserId: user.id,
      },
    });
    if (subscriptions.length !== 0) {
      isProUser = true;
    }
  }
  return {
    user,
    isProUser,
  };
};
