"use client";

import { useTransition } from "react";
import { updateKitchenStatus } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function KitchenStatusControl({ orderId, currentStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (nextStatus) => {
    startTransition(async () => {
      try {
        await updateKitchenStatus(orderId, nextStatus);
        router.refresh();
      } catch (err) {
        alert(err.message);
      }
    });
  };

  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      {currentStatus === "pending" && (
        <button
          onClick={() => handleStatusChange("preparing")}
          disabled={isPending}
          className="btn-figma btn-figma--outline"
          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", borderColor: "var(--color-turmeric)", color: "var(--color-turmeric)" }}
        >
          {isPending ? "..." : "🔥 Start Cooking"}
        </button>
      )}

      {currentStatus === "preparing" && (
        <button
          onClick={() => handleStatusChange("ready")}
          disabled={isPending}
          className="btn-figma btn-figma--primary"
          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem" }}
        >
          {isPending ? "..." : "🍲 Mark Ready"}
        </button>
      )}

      {currentStatus === "ready" && (
        <button
          onClick={() => handleStatusChange("completed")}
          disabled={isPending}
          className="btn-figma btn-figma--outline"
          style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", borderColor: "var(--color-forest)", color: "var(--color-forest)" }}
        >
          {isPending ? "..." : "✓ Complete"}
        </button>
      )}
    </div>
  );
}
