"use client";

import { useUser } from "@clerk/nextjs";

type Props = {
  amount: number;
  plan: string;
};

export const RazorpayButton = ({ amount, plan }: Props) => {
  const { user } = useUser();

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to pay");
      return;
    }

    // Step 1: Create Razorpay order
    const res = await fetch("/api/razorpay/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, plan, userId: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create order");
      return;
    }

    // Step 2: Define Razorpay options
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "AI Form Generator",
      description: `Payment for ${plan} Plan`,
      order_id: data.orderId,
      handler: function () {
        // ✅ Payment succeeded - rely on Razorpay Webhook to handle DB
        alert("✅ Payment successful!");
        // Redirect user to a success page if needed
        window.location.href = "/payment-success";
      },
      prefill: {
        name: user.fullName || "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        contact: user.phoneNumbers?.[0]?.phoneNumber || "",
      },
      theme: {
        color: "#6366f1",
      },
    };

    // Step 3: Load Razorpay SDK and launch checkout
    const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        alert("Failed to load Razorpay SDK. Please try again later.");
      };
      document.body.appendChild(script);
    } else {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      Pay ₹{amount} for {plan}
    </button>
  );
};
