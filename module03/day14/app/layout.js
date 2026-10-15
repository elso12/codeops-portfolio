import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Mesob House - Authentic Habesha Cuisine",
  description:
    "Premium Ethiopian and Eritrean restaurant brand. Order authentic dishes delivered to your door.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
