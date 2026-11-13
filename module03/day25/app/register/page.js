import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Join Mesob House Community",
  description:
    "Create your Addis Eats account to order hot Habesha meals, earn communal loyalty rewards, and book ceremonial dining reservations.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
      <RegisterForm />
    </div>
  );
}
