import LoginForm from "./LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Member Sign In & Account Access",
  description:
    "Sign in to your Addis Eats account with cryptographic session cookies to track live orders and manage your dining preferences.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const nextParam = resolvedParams?.next || "/orders";

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
      <LoginForm nextDestination={nextParam} />
    </div>
  );
}
