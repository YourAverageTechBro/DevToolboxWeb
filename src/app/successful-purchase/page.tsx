import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import SuccessfulPurchaseClientComponent from "@/app/successful-purchase/SuccessfulPurchase";

export default async function SuccessfulPurchase({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id);

  return (
    <div className={"flex w-full mt-24 justify-center"}>
      <SuccessfulPurchaseClientComponent checkoutSession={checkoutSession} />
    </div>
  );
}
