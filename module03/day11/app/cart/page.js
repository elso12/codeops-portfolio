import Link from "next/link";
import ClientNavButton from "@/app/components/ClientNavButton";

export const metadata = {
  title: "Your Cart | Addis Eats",
  description: "Review your Addis Eats order before proceeding to checkout.",
};

// Next.js App Router Page: app/cart/page.js
export default function CartPage() {
  const cartItems = [
    {
      id: "doro-wat",
      name: "Royal Doro Wat",
      amharic: "የዶሮ ወጥ",
      quantity: 1,
      price: 350,
      notes: "Extra spicy, with teff injera",
    },
    {
      id: "kitfo",
      name: "Special Gurage Kitfo",
      amharic: "ልዩ የጉራጌ ክትፎ",
      quantity: 1,
      price: 380,
      notes: "Leb-leb, served with ayib and gomen",
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 50;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Route Badge & Header */}
      <div className="border-b border-stone-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
            <span>Route:</span>
            <code className="bg-stone-800 px-2 py-0.5 rounded text-stone-200">/cart (app/cart/page.js)</code>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Your Order Basket
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            2 traditional dishes freshly prepared for Habesha feast delivery.
          </p>
        </div>

        <Link
          href="/menu"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          + Add More Dishes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className="text-xs text-amber-400/80 font-serif">
                    {item.amharic}
                  </span>
                </div>
                <p className="text-xs text-stone-400">{item.notes}</p>
                <div className="pt-2">
                  <Link
                    href={`/menu/${item.id}`}
                    className="text-xs text-stone-400 hover:text-amber-400 transition-colors underline"
                  >
                    View details via dynamic route (/menu/{item.id})
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
                <span className="text-xs text-stone-400">Qty: {item.quantity}</span>
                <span className="text-lg font-black text-amber-400">
                  {item.price * item.quantity} ETB
                </span>
              </div>
            </div>
          ))}

          {/* Router Information Note */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300 space-y-1">
            <p className="font-semibold text-amber-300">
              💡 Requirement 5: Programmatic Navigation
            </p>
            <p className="text-stone-400">
              The checkout button below is a client component invoking <code>router.push(&quot;/checkout&quot;)</code> from <code>next/navigation</code> rather than a static link.
            </p>
          </div>
        </div>

        {/* Order Summary & Checkout Trigger */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-lg font-bold text-white pb-3 border-b border-stone-800">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-stone-300">
            <div className="flex justify-between">
              <span className="text-stone-400">Subtotal</span>
              <span>{subtotal} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Delivery (Addis Ababa)</span>
              <span>{deliveryFee} ETB</span>
            </div>
            <div className="pt-3 border-t border-stone-800 flex justify-between text-base font-bold text-white">
              <span>Total Amount</span>
              <span className="text-amber-400 font-black">{grandTotal} ETB</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Requirement 5: Client component pushing with useRouter */}
            <ClientNavButton
              href="/checkout"
              label="Proceed to Checkout (useRouter)"
              variant="primary"
              className="w-full py-3"
            />

            <Link
              href="/menu"
              className="block text-center text-xs text-stone-400 hover:text-white py-2 transition-colors"
            >
              ← Continue Browsing Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
