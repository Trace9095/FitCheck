/**
 * Server-side GA4 event tracking via Measurement Protocol.
 * Used in Stripe webhook handlers to track purchases server-side
 * (immune to ad blockers).
 *
 * Requires env vars: GA4_MEASUREMENT_ID, GA4_API_SECRET
 */

interface GA4Event {
  name: string
  params: Record<string, string | number>
}

export async function sendGA4ServerEvent(events: GA4Event[], clientId?: string): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) return

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId || `server_${Date.now()}`,
          events,
        }),
      }
    )
  } catch {
    // Non-critical — don't break the webhook flow
  }
}

export async function sendGA4PurchaseEvent(params: {
  transactionId: string
  value: number
  currency: string
  itemName: string
  clientId?: string
}): Promise<void> {
  await sendGA4ServerEvent(
    [
      {
        name: 'purchase',
        params: {
          transaction_id: params.transactionId,
          value: params.value,
          currency: params.currency.toUpperCase(),
          items: JSON.stringify([
            { item_name: params.itemName, price: params.value, quantity: 1 },
          ]),
        },
      },
    ],
    params.clientId
  )
}
