/**
 * Addis Eats Orders API
 */

export async function submitOrder(orderPayload) {
  // Simulate network latency for checkout submission
  await new Promise((res) => setTimeout(res, 800));

  // Generate unique Ethiopian order reference
  const orderRef = `AE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderRecord = {
    id: orderRef,
    ...orderPayload,
    placedAt: new Date().toISOString(),
    status: 'Confirmed - In Kitchen Preparation',
    estimatedDelivery: '30-40 minutes',
  };

  // Persist order in local history
  try {
    const existing = JSON.parse(localStorage.getItem('addis_eats_orders') || '[]');
    localStorage.setItem('addis_eats_orders', JSON.stringify([orderRecord, ...existing]));
  } catch {
    // localStorage failure non-fatal
  }

  return orderRecord;
}
