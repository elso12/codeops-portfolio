/**
 * app/api/orders/[id]/stream/route.js
 *
 * Server-Sent Events (SSE) Route Handler for real-time delivery tracking.
 * Requirements:
 * - Proper SSE framing: "data: " + JSON string + "\n\n" (two newlines required)
 * - Headers: Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive
 * - Push live status and courier coordinates progressing toward destination
 * - Deliberately close stream upon reaching "delivered" state
 * - Clean up timers and resources on client disconnect (request.signal abort)
 */

import { getOrderById } from "@/lib/data";
import { getSession } from "@/lib/session";

// Area coordinates across Addis Ababa [lat, lng]
const AREA_COORDINATES = {
  "Bole Rwanda": [8.9950, 38.7896],
  "Bole": [8.9980, 38.7860],
  "Kazanchis": [9.0105, 38.7615],
  "Piassa": [9.0350, 38.7520],
  "Sarbet": [9.0020, 38.7350],
  "Mexico": [9.0120, 38.7450],
  "Old Airport": [8.9880, 38.7410],
  "CMC": [9.0230, 38.8350],
  "Merkato": [9.0310, 38.7390],
  "Lideta": [9.0150, 38.7380],
  "Yeka": [9.0310, 38.7950],
  "Nifas Silk": [8.9680, 38.7510],
  "Kolfe": [9.0220, 38.7180],
  "Gulele": [9.0620, 38.7480],
  "Addis Ketema": [9.0360, 38.7360],
};

const RESTAURANT_LOCATION = {
  name: "Mesob House · Bole Atlas",
  area: "Bole Atlas",
  position: [9.0080, 38.7750],
};

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  // 1. Authentication Layer: Verify session cookie
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const resolvedParams = await Promise.resolve(params);
  const orderId = resolvedParams?.id;

  // 2. Existence Check
  const order = getOrderById(orderId, user.id);
  if (!order) {
    return Response.json(
      { error: "Not found", detail: `No order with id "${orderId}"` },
      { status: 404 }
    );
  }

  // 3. Authorization Layer: Enforce record ownership or staff role (Anti-IDOR)
  if (order.userId !== user.id && user.role !== "staff") {
    return Response.json(
      { error: "Forbidden", detail: "You do not have permission to track this order." },
      { status: 403 }
    );
  }

  const destinationCoord =
    AREA_COORDINATES[order.area] || [8.9950, 38.7896];

  const destination = {
    name: order?.customerName || "Customer Destination",
    area: order?.area || "Bole Rwanda",
    position: destinationCoord,
    address: order?.address || `${order?.area || "Bole Rwanda"}, House 42`,
    notes: order?.notes || "Fragile — handle with care",
  };

  const url = new URL(request.url);
  const forceSimulate =
    url.searchParams.get("simulate") === "true" || url.searchParams.get("reset") === "true";

  // Pre-calculate trajectory interpolation between Restaurant and Destination
  const totalSteps = 6;
  const startLat = RESTAURANT_LOCATION.position[0];
  const startLng = RESTAURANT_LOCATION.position[1];
  const destLat = destination.position[0];
  const destLng = destination.position[1];

  let currentStep =
    !forceSimulate && (order.status === "completed" || order.status === "delivered") ? 5 : 0;
  let intervalId = null;

  const stream = new ReadableStream({
    start(controller) {
      // Helper function with exact SSE framing: "data: " + payload + "\n\n"
      const send = (data) => {
        try {
          const payload = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(payload));
        } catch (err) {
          console.error("SSE stream enqueue error:", err);
        }
      };

      const getPayloadForStep = (step) => {
        const fraction = Math.min(step / (totalSteps - 1), 1);
        const courierLat = Number((startLat + (destLat - startLat) * fraction).toFixed(5));
        const courierLng = Number((startLng + (destLng - startLng) * fraction).toFixed(5));

        let status = "preparing";
        let statusMessage = "Kitchen is assembling your fresh dishes...";
        let etaMinutes = 18;

        if (step === 1) {
          status = "preparing";
          statusMessage = "Order packaged; courier assigned and loading thermal box.";
          etaMinutes = 14;
        } else if (step >= 2 && step <= 3) {
          status = "on_the_way";
          statusMessage = "Courier in transit through Bole corridor.";
          etaMinutes = 8;
        } else if (step === 4) {
          status = "nearby";
          statusMessage = "Courier is entering your neighbourhood block.";
          etaMinutes = 2;
        } else if (step >= 5) {
          status = "delivered";
          statusMessage = "Order successfully delivered! Bon appétit!";
          etaMinutes = 0;
        }

        const now = new Date();
        const etaDate = new Date(now.getTime() + etaMinutes * 60 * 1000);

        return {
          orderId,
          step,
          totalSteps,
          status,
          statusMessage,
          etaMinutes,
          estimatedDeliveryTime: etaDate.toISOString(),
          updatedAt: now.toISOString(),
          restaurant: RESTAURANT_LOCATION,
          destination,
          courier: {
            name: "Almaz Worku",
            phone: "+251 91 123 4567",
            vehicle: "TVS Apache 160 (Motorcycle - AA 3-B9201)",
            position: [courierLat, courierLng],
            distanceKm: Number(((1 - fraction) * 3.4).toFixed(1)),
          },
          orderSummary: {
            id: order?.id || orderId,
            dishName: order?.dish?.name || "Traditional Mesob Selection",
            quantity: order?.quantity || 1,
            total: order?.total || 360,
            currency: order?.currency || "ETB",
            area: order?.area || "Bole Rwanda",
            paymentMethod: order?.paymentMethod || "telebirr",
            createdAt: order?.createdAt || now.toISOString(),
          },
        };
      };

      // 1. Immediately seed the stream with initial status
      send(getPayloadForStep(currentStep));

      // If already delivered and not simulating, close cleanly
      if (currentStep >= totalSteps - 1) {
        try {
          controller.close();
        } catch (_) {}
        return;
      }

      // 2. Stream subsequent updates every 3.5 seconds
      intervalId = setInterval(() => {
        currentStep++;
        const payload = getPayloadForStep(currentStep);
        send(payload);

        // When delivery is reached, deliberately close the stream
        if (payload.status === "delivered") {
          clearInterval(intervalId);
          intervalId = null;
          try {
            controller.close();
          } catch (_) {}
        }
      }, 3500);

      // Clean up if client disconnects or connection drops
      if (request.signal) {
        request.signal.addEventListener("abort", () => {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          try {
            controller.close();
          } catch (_) {}
        });
      }
    },
    cancel() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
