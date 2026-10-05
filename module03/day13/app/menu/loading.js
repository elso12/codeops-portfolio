/**
 * app/menu/loading.js - Server Component
 * Next.js reserved loading boundary displayed during route transitions.
 */
export default function MenuLoading() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '220px', height: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }} />
        <div style={{ width: '120px', height: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '6px' }} />
      </div>

      <div className="dish-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="dish-card"
            style={{
              minHeight: '240px',
              opacity: 0.5,
              animation: 'pulse 1.5s infinite ease-in-out'
            }}
          >
            <div style={{ width: '55%', height: '1.4rem', background: 'var(--border-color)', borderRadius: '6px', marginBottom: '1rem' }} />
            <div style={{ width: '100%', height: '3.5rem', background: 'var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
              <div style={{ width: '60px', height: '1.5rem', background: 'var(--border-color)', borderRadius: '4px' }} />
              <div style={{ width: '100px', height: '2rem', background: 'var(--border-color)', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
