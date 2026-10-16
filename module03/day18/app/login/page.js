import LoginForm from "./LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Mesob House Restaurant",
  description: "Sign into your Mesob House dining profile to track live deliveries and manage orders.",
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
