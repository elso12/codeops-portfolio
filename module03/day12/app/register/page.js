import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Register & Join Mesob Club | Addis Eats',
  description: 'Create an account at Addis Eats · Mesob House to unlock exclusive table reservations, Gursha rewards, and order tracking.',
};

export default function RegisterPage() {
  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-turmeric)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
          }}
        >
          ምዝገባ · New Member Registration
        </span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>
          Join Addis Eats · Mesob Club
        </h1>
        <p style={{ maxWidth: '520px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Register for seamless Habesha feasts, priority mesob tables, and communal hospitality rewards.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
