import ReservationForm from './ReservationForm';

export const metadata = {
  title: 'Table Reservations | Mesob House',
  description: 'Reserve a traditional handcrafted mesob table or cultural dining lounge at Mesob House Addis Ababa.',
};

export default function ReservationsPage() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--color-turmeric)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem'
        }}>
          ጠረጴዛ ማስያዣ · Table Bookings
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '1rem' }}>
          Reserve Your Mesob Experience
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Join us for communal Habesha dining. Whether an intimate date for two or a grand family feast, 
          we have a woven mesob waiting for you.
        </p>
      </div>

      <ReservationForm />
    </div>
  );
}
