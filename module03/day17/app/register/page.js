import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Register | Mesob House Restaurant",
  description: "Create an account with Mesob House for exclusive dining benefits, order tracking, and table reservations.",
};

export default function RegisterPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
      <RegisterForm />
    </div>
  );
}
