// /app/api/razorpay/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;
export async function GET() {
  return NextResponse.json({ message: "Webhook route GET works" });
}


export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("❌ Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  console.log("✅ Webhook event received:", event.event);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    console.log("💰 Payment entity:", payment);

    const userId = payment.notes?.userId;
    if (!userId) {
      console.error("❌ Missing userId in payment.notes");
      return NextResponse.json(
        { error: "Missing userId in notes" },
        { status: 400 }
      );
    }

    try {
      await prisma.subscription.upsert({
        where: { userId },
        update: { subscribed: true },
        create: {
          userId,
          subscribed: true,
          paymentId: payment.id,
          orderId: payment.order_id,
          plan: payment.notes?.plan ?? "unknown",
        },
      });

     

      console.log("✅ Subscription updated for user:", userId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ DB error", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Event not handled" }, { status: 200 });
}
