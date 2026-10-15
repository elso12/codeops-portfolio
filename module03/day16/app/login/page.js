import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In | Mesob House Restaurant",
  description: "Sign into your Mesob House dining profile to track live deliveries and manage table reservations.",
};

export default function LoginPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
      <LoginForm />
    </div>
  );
}
