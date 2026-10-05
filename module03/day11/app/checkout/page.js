import Link from "next/link";
import ClientNavButton from "@/app/components/ClientNavButton";

export const metadata = {
  title: "Checkout | Addis Eats",
  description: "Complete your order with Telebirr, CBE Birr, or Cash on Delivery.",
};

// Next.js App Router Page: app/checkout/page.js
export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Route Badge & Header */}
      <div className="border-b border-stone-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
            <span>Route:</span>
            <code className="bg-stone-800 px-2 py-0.5 rounded text-stone-200">/checkout (app/checkout/page.js)</code>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Checkout & Delivery
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Choose your preferred delivery neighborhood and payment method.
          </p>
        </div>

        <Link
          href="/cart"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          ← Return to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📍</span> 1. Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  defaultValue="Almaz Tesfaye"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  defaultValue="+251 91 123 4567"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Subcity / Neighborhood
                </label>
                <select
                  defaultValue="Bole"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Bole">Bole (Atlas / Rwanda / Medhanialem)</option>
                  <option value="Kazanchis">Kazanchis (Near UNECA)</option>
                  <option value="Piassa">Piassa / Arada</option>
                  <option value="Sarbet">Sarbet / Old Airport</option>
                  <option value="CMC">CMC / Ayat</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Specific Street or Landmark
                </label>
                <input
                  type="text"
                  defaultValue="Behind Edna Mall, Building 4, 3rd Floor"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💳</span> 2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-950 border border-amber-500/50 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-amber-500" />
                <div>
                  <span className="block text-sm font-bold text-white">Telebirr</span>
                  <span className="block text-[10px] text-stone-400">Instant digital pay</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 cursor-pointer">
                <input type="radio" name="payment" className="accent-amber-500" />
                <div>
                  <span className="block text-sm font-bold text-white">CBE Birr</span>
                  <span className="block text-[10px] text-stone-400">Bank direct</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 cursor-pointer">
                <input type="radio" name="payment" className="accent-amber-500" />
                <div>
                  <span className="block text-sm font-bold text-white">Cash</span>
                  <span className="block text-[10px] text-stone-400">Pay on delivery</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-stone-800">
            Order Review
          </h2>

          <div className="space-y-3 text-xs text-stone-300">
            <div className="flex justify-between">
              <span>1x Royal Doro Wat</span>
              <span className="font-semibold">350 ETB</span>
            </div>
            <div className="flex justify-between">
              <span>1x Special Gurage Kitfo</span>
              <span className="font-semibold">380 ETB</span>
            </div>
            <div className="flex justify-between text-stone-400 pt-2 border-t border-stone-800">
              <span>Delivery Fee</span>
              <span>50 ETB</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-stone-800">
              <span>Total to Pay</span>
              <span className="text-amber-400 font-black">780 ETB</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Requirement 5: Client component pushing with useRouter */}
            <ClientNavButton
              href="/"
              label="Place Order (useRouter.push('/'))"
              variant="accent"
              className="w-full py-3 text-center"
            />

            <Link
              href="/cart"
              className="block text-center text-xs text-stone-400 hover:text-white py-1 transition-colors"
            >
              Modify items in cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
