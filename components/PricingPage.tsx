"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { PricingPlan, pricingPlan } from "@/lib/pricingplan";
import { Badge } from "./ui/badge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingPageProps {
  userId?: string | null;  // fix here to allow undefined or null
}

const PricingPage: React.FC<PricingPageProps> = ({ userId }) => {
  const handlePayment = async (plan: PricingPlan) => {
    const amount = plan.level === "Free" ? 0 : plan.level === "Pro" ? 2900 : 7000;

    if (amount === 0) {
      alert(`Free plan activated! User ID: ${userId ?? "unknown"}`);
      return;
    }

    const res = await fetch("/api/razorpay/checkout-session", {
      method: "POST",
      body: JSON.stringify({ amount, plan: plan.level, userId }),
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: data.currency,
      name: "AI Form Generator",
      description: `Purchase ${plan.level} Plan`,
      order_id: data.id,
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "User",
        email: "user@example.com",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="px-4 py-10">
      <div className="text-center mb-16">
        <h1 className="font-extrabold text-4xl text-gray-800 dark:text-white">
          Plans and Pricing
        </h1>
        <p className="text-gray-500 mt-2">
          Receive unlimited credits when you pay early and save your plan
        </p>
        {userId && <p className="mt-2 text-sm text-gray-400"></p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {pricingPlan.map((plan: PricingPlan, index: number) => (
          <Card
            key={index}
            className={`relative group transition duration-300 ease-in-out transform hover:scale-105 w-full max-w-sm mx-auto 
              ${
                plan.level === "Enterprise"
                  ? "bg-[#1c1c1c] text-white"
                  : "bg-white dark:bg-gray-900"
              } overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-500`}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-70 blur-sm transition-all duration-300 pointer-events-none z-0" />
            <div className="relative z-10">
              <CardHeader className="flex flex-row items-center gap-2">
                <CardTitle className="text-2xl font-semibold">{plan.level}</CardTitle>
                {plan.level === "Pro" && (
                  <Badge className="rounded-full bg-orange-600 text-white">Popular</Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.services.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className={`w-full mt-7 ${
                    plan.level === "Enterprise" ? "text-black dark:text-white" : ""
                  }`}
                  onClick={() => handlePayment(plan)}
                >
                  Get started with {plan.level}
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
