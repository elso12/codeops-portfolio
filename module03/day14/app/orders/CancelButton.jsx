"use client";
/**
 * app/orders/CancelButton.jsx — Client Component
 *
 * useTransition gives us the isPending flag while the server action runs.
 * The check is INSIDE cancelOrder on the server — hiding this button is UX,
 * not security.
 */
import { useTransition } from "react";
import { cancelOrder } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function CancelButton({ orderId }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    startTransition(async () => {
      try {
        await cancelOrder(orderId);
        router.refresh(); // Re-fetch the server component data
      } catch (err) {
        alert(err.message);
      }
    });
  }

  return (
    <button
      id={`cancel-${orderId}`}
      className="btn btn-danger btn-sm"
      onClick={handleCancel}
      disabled={isPending}
      aria-label={`Cancel order ${orderId}`}
    >
      {isPending ? (
        <><span className="spinner" aria-hidden="true" /> Cancelling…</>
      ) : (
        "Cancel"
      )}
    </button>
  );
}
