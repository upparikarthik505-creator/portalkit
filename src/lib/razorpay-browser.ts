export type RazorpayOrderPayload = {
  keyId: string;
  description: string;
  name?: string;
  email?: string;
  notes?: Record<string, string>;
  /** One-shot order checkout */
  orderId?: string;
  amount?: number | string;
  currency?: string;
  /** Recurring subscription checkout */
  subscriptionId?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

function loadCheckoutScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window unavailable"));
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script failed"));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(
  order: RazorpayOrderPayload,
  onSuccess: (result: {
    razorpay_order_id?: string;
    razorpay_subscription_id?: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>,
) {
  await loadCheckoutScript();
  if (!window.Razorpay) throw new Error("Razorpay unavailable");
  if (!order.orderId && !order.subscriptionId) {
    throw new Error("Missing order or subscription");
  }

  return new Promise<void>((resolve, reject) => {
    const options: Record<string, unknown> = {
      key: order.keyId,
      name: "PortalKit",
      description: order.description,
      notes: order.notes ?? {},
      prefill: {
        name: order.name ?? "",
        email: order.email ?? "",
      },
      theme: { color: "#ff5a5f" },
      handler: async (response: {
        razorpay_order_id?: string;
        razorpay_subscription_id?: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          await onSuccess(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Checkout canceled")),
      },
    };

    if (order.subscriptionId) {
      options.subscription_id = order.subscriptionId;
    } else {
      options.order_id = order.orderId;
      options.amount = order.amount;
      options.currency = order.currency;
    }

    const rzp = new window.Razorpay!(options);
    rzp.open();
  });
}
