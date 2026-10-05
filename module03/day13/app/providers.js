'use client';

import { CartProvider } from '../lib/CartContext';

/**
 * Providers client component
 * Encapsulates client-side context providers (like CartProvider)
 * and passes children down the component tree.
 * This keeps app/layout.js on the server side without any "use client" directive.
 */
export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
