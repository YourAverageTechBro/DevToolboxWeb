"use server";

import prisma from "@/db/prisma";
import { currentUser } from "@clerk/nextjs";
import { SubscriptionStatus } from "@prisma/client";

export const getUserAndSubscriptionState = async () => {
  const user = await currentUser();
  let isProUser = false;
  if (user) {
    const subscriptions = await prisma.subscriptions.findMany({
      where: {
        clerkUserId: user.id,
      },
    });
    if (
      subscriptions.length !== 0 &&
      subscriptions[0].subscriptionStatus === SubscriptionStatus.ACTIVE
    ) {
      isProUser = true;
    }
  }
  return {
    user,
    isProUser,
  };
};
