import LoginForm from './LoginForm';

export const metadata = {
  title: 'Guest Login & Account | Mesob House',
  description: 'Sign in to your Mesob House account or continue as a guest for fast Habesha order pickup and table bookings.',
};

export default function LoginPage() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--color-turmeric)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem'
        }}>
          መግቢያ · Account &amp; Guest Access
        </span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>
          Welcome to Mesob House
        </h1>
        <p style={{ maxWidth: '500px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Continue as a guest or sign in to your Habesha dining account.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
