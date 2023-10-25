import type { Stripe } from "stripe";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { SubscriptionStatus } from ".prisma/client";

export const POST = async (req: NextRequest) => {
  console.log("Starting endpoint", {
    path: "webhooks/stripe",
    method: "POST",
  });
  let event: Stripe.Event;
  let text;
  try {
    text = await req.text();
    console.log("Successfully parsed stripe webhook event", {
      text,
    });
    event = stripe.webhooks.constructEvent(
      text,
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.error("Error onendpoint", {
      text,
      path: "webhooks/stripe",
      method: "POST",
      error: errorMessage,
    });
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Successfully constructed event.
  console.log("Successfully parsed stripe webhook event", {
    text,
    path: "webhooks/stripe",
    method: "POST",
    event,
  });

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "invoice.paid",
    "customer.subscription.deleted",
    "invoice.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;
    let stripeCustomerId;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          console.log("Starting to handle checkout.session.completed", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          data = event.data.object as Stripe.Checkout.Session;
          const { userId } = data.metadata as { userId: string };
          stripeCustomerId = data.customer as string;
          await prisma.subscriptions.create({
            data: {
              stripeCustomerId,
              clerkUserId: userId,
              subscriptionStatus: SubscriptionStatus.ACTIVE,
            },
          });
          console.log("Completed handling checkout.session.completed", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          break;
        case "invoice.paid":
          console.log("Starting to handle invoice.paid", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          data = event.data.object as Stripe.Invoice;
          stripeCustomerId = data.customer as string;
          await prisma.subscriptions.update({
            where: {
              stripeCustomerId,
            },
            data: {
              subscriptionStatus: SubscriptionStatus.ACTIVE,
            },
          });
          console.log("Completed handling invoice.paid", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          break;
        case "customer.subscription.deleted":
          console.log("Starting to handle customer.subscription.deleted", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          data = event.data.object as Stripe.Subscription;
          stripeCustomerId = data.customer as string;
          await prisma.subscriptions.delete({
            where: {
              stripeCustomerId,
            },
          });
          console.log("Completed handling customer.subscription.deleted", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          break;
        case "invoice.payment_failed":
          console.log("Starting to handle invoice.payment_failed", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          data = event.data.object as Stripe.Invoice;
          stripeCustomerId = data.customer as string;
          await prisma.subscriptions.update({
            where: {
              stripeCustomerId,
            },
            data: {
              subscriptionStatus: SubscriptionStatus.INACTIVE,
            },
          });
          console.log("Completed handling invoice.payment_failed", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            eventType: event.type,
            event,
          });
          break;
        default:
          console.error("Error onendpoint", {
            text,
            path: "webhooks/stripe",
            method: "POST",
            error: `Unhandled event: ${event.type}`,
          });
          return NextResponse.json(
            { message: "Unknown event" },
            { status: 400 }
          );
      }
    } catch (error) {
      console.error("Error on endpoint", {
        text,
        path: "webhooks/stripe",
        method: "POST",
        error,
      });
      return NextResponse.json(
        { message: "Webhook handler failed", error },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
};
