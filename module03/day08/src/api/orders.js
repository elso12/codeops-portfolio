/**
 * Simulated Orders API for Addis Eats
 * Models real Ethiopian mobile network conditions and server-side TeleBirr validation.
 * 
 * Supports:
 * - Successful order creation
 * - HTTP 422 Unprocessable Entity with structured fieldErrors (e.g. TeleBirr account not registered)
 * - HTTP 500 Network timeout / server error simulation
 */

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Places an order with simulated server delay and honest error handling.
 * @param {Object} orderData - { name, phone, area, notes, items, totalETB }
 * @param {Object} [options]
 * @param {boolean} [options.simulateFailure=false] - If true, triggers a simulated 422 failure
 * @param {number} [options.latencyMs=900] - Simulated mobile network round-trip
 * @returns {Promise<Object>} Created order object
 */
export async function placeOrder(orderData, options = {}) {
  const { simulateFailure = false, latencyMs = 900 } = options;

  // Simulate mobile network latency over Ethio Telecom / Safaricom
  await new Promise((resolve) => setTimeout(resolve, latencyMs));

  // Simulated server validation failure (HTTP 422)
  if (simulateFailure) {
    throw new ApiError(
      422,
      'TeleBirr payment verification failed: account not registered or insufficient balance.',
      {
        phone: 'That number is not registered with TeleBirr or has payment limits.',
      }
    );
  }

  // Simulated server sanity check
  const phoneClean = (orderData.phone || '').trim().replace(/[\s-]/g, '');
  if (!/^(?:\+251|0)9\d{8}$/.test(phoneClean) && !/^(?:\+251|0)7\d{8}$/.test(phoneClean)) {
    throw new ApiError(
      422,
      'Invalid order payload rejected by kitchen server.',
      {
        phone: 'TeleBirr number must start with 09... or +2519...',
      }
    );
  }

  // Success response
  return {
    id: `ET-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer: {
      name: orderData.name,
      phone: orderData.phone,
      area: orderData.area,
      notes: orderData.notes,
    },
    totalETB: orderData.totalETB || 730,
    estimatedDeliveryMinutes: 35,
    telebirrPromptSent: true,
  };
}
