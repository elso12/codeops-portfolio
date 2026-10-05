import Link from 'next/link';

export const metadata = {
  title: 'Special Offers & Feasts | Mesob House',
  description: 'Exclusive dining specials, communal banquet discounts, and traditional Habesha coffee tasting promotions at Mesob House.',
};

export default function OffersPage() {
  const offers = [
    {
      id: 'weekend-mesob',
      title: 'Grand Mesob Feast for Two',
      amharic: 'የሳምንቱ መጨረሻ ልዩ ግብዣ',
      discount: '15% OFF',
      code: 'MESOB15',
      badge: 'Weekend Highlight',
      description: 'Enjoy generous portions of Royal Doro Wat, Special Gurage Kitfo, and Yetsom Beyaynetu, served on a giant handcrafted mesob with endless teff injera and two traditional honey wines (Tej).',
      price: '$59.50',
      regularPrice: '$70.00',
      validUntil: 'Available Every Friday – Sunday'
    },
    {
      id: 'fasting-special',
      title: 'Yetsom Vegan Wednesday & Friday',
      amharic: 'የጾም ቀናት ልዩ ቅናሽ',
      discount: 'FREE SPICED TEA',
      code: 'YETSOM',
      badge: 'Fasting Tradition',
      description: 'Order any Grand Yetsom Beyaynetu fasting platter and receive a complimentary pot of spiced ginger-cinnamon highland Shai and fresh timatim fitfit.',
      price: '$21.00',
      regularPrice: '$26.00',
      validUntil: 'Wednesdays & Fridays All Day'
    },
    {
      id: 'jebena-buna',
      title: 'Complimentary Jebena Buna Ceremony',
      amharic: 'የነጻ ጀበና ቡና ሥነ-ሥርዓት',
      discount: 'FREE CEREMONY',
      code: 'BUNATIME',
      badge: 'Cultural Experience',
      description: 'Tableside green bean roasting, fresh stone pounding, and triple-boiled black claypot jebena coffee with fragrant frankincense aroma on all dinner orders over $50.',
      price: 'Free with $50+ Dine-In',
      regularPrice: '$14.00',
      validUntil: 'Daily after 5:00 PM'
    },
    {
      id: 'tibs-platter',
      title: 'Flame-Seared Tibs & Honey Wine Combo',
      amharic: 'ጥብስ እና የማር ጠጅ ጥምረት',
      discount: '$10 SAVINGS',
      code: 'TIBSFEAST',
      badge: 'Chef Signature',
      description: 'Sizzling Zilzil Tibs served bubbling hot in an earthenware stove, paired with an artisan carafe of aged Sheba Tej honey wine.',
      price: '$34.00',
      regularPrice: '$44.00',
      validUntil: 'Monday – Thursday'
    }
  ];

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--color-turmeric)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem'
        }}>
          ልዩ ቅናሾች · Seasonal Specials
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '1rem' }}>
          Mesob House Special Offers
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Experience the generosity of Habesha hospitality with our curated dining packages, 
          communal banquet celebrations, and complimentary ceremonial treats.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'linear-gradient(135deg, var(--color-paprika), var(--color-turmeric))',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(186, 51, 32, 0.4)'
            }}>
              {offer.discount}
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-turmeric)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {offer.badge}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.2rem', color: '#fff' }}>
                {offer.title}
              </h2>
              <span style={{ fontSize: '0.95rem', color: 'var(--color-turmeric)', display: 'block', marginBottom: '1rem' }}>
                {offer.amharic}
              </span>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                {offer.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-turmeric)' }}>
                    {offer.price}
                  </span>{' '}
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                    {offer.regularPrice}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Code: <code style={{ color: '#fff', background: 'var(--bg-secondary)', padding: '0.2rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{offer.code}</code>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                ⏰ {offer.validUntil}
              </div>

              <Link href="/menu" className="btn btn-primary" style={{ width: '100%' }}>
                Order with Special &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
