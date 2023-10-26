"use client";

import { Stripe } from "stripe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessfulPurchaseClientComponent({
  checkoutSession,
}: {
  checkoutSession: Stripe.Checkout.Session;
}) {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/tools/json-validator");
    }, 3000);
  }, []);

  const statusString =
    checkoutSession.payment_status === "paid"
      ? "Congrats on your purchase!"
      : "Something went wrong. Please try again.";

  return (
    <div className={"w-full text-center"}>
      <p className={"text-2xl font-bold"}> {statusString}</p>
      <p className={"text-2xl font-bold"}>
        Redirecting you back to the home page in a few seconds...
      </p>
    </div>
  );
}
