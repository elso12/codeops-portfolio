import Link from "next/link";

export const metadata = {
  title: "Special Offers & Feasts | Mesob House",
  description: "Exclusive dining specials, communal banquet discounts, and traditional Habesha coffee tasting promotions at Mesob House.",
};

export default function OffersPage() {
  const offers = [
    {
      id: "weekend-mesob",
      title: "Grand Mesob Feast for Two",
      amharic: "የሳምንቱ መጨረሻ ልዩ ግብዣ",
      discount: "15% OFF",
      code: "MESOB15",
      badge: "Weekend Highlight",
      description: "Enjoy generous portions of Royal Doro Wat, Special Gurage Kitfo, and Yetsom Beyaynetu, served on a giant handcrafted mesob with endless teff injera and two traditional honey wines (Tej).",
      price: "450",
      regularPrice: "530",
      validUntil: "Available Every Friday – Sunday",
      dishId: "dish_001",
    },
    {
      id: "fasting-special",
      title: "Yetsom Vegan Wednesday & Friday",
      amharic: "የጾም ቀናት ልዩ ቅናሽ",
      discount: "FREE SPICED TEA",
      code: "YETSOM",
      badge: "Fasting Tradition",
      description: "Order any Grand Yetsom Beyaynetu fasting platter and receive a complimentary pot of spiced ginger-cinnamon highland Shai and fresh timatim fitfit.",
      price: "180",
      regularPrice: "220",
      validUntil: "Wednesdays & Fridays All Day",
      dishId: "dish_003",
    },
    {
      id: "jebena-buna",
      title: "Complimentary Jebena Buna Ceremony",
      amharic: "የነጻ ጀበና ቡና ሥነ-ሥርዓት",
      discount: "FREE CEREMONY",
      code: "BUNATIME",
      badge: "Cultural Experience",
      description: "Tableside green bean roasting, fresh stone pounding, and triple-boiled black claypot jebena coffee with fragrant frankincense aroma on all dinner orders over 300 ETB.",
      price: "FREE",
      regularPrice: "80 ETB",
      validUntil: "Daily after 5:00 PM (Orders 300+ ETB)",
      dishId: "dish_006",
    },
    {
      id: "tibs-platter",
      title: "Flame-Seared Tibs & Honey Wine Combo",
      amharic: "ጥብስ እና የማር ጠጅ ጥምረት",
      discount: "10% SAVINGS",
      code: "TIBSFEAST",
      badge: "Chef Signature",
      description: "Sizzling Zilzil Tibs served bubbling hot in an earthenware stove, paired with an artisan carafe of aged Sheba Tej honey wine.",
      price: "240",
      regularPrice: "270",
      validUntil: "Monday – Thursday All Day",
      dishId: "dish_002",
    },
  ];

  return (
    <div className="container">
      <div className="section-header-centered">
        <span className="section-eyebrow">ልዩ ቅናሾች · SEASONAL SPECIALS</span>
        <h1 className="section-title-large">Mesob House Special Offers</h1>
        <p className="section-sub-centered">
          Experience the generosity of Habesha hospitality with our curated dining packages, 
          communal banquet celebrations, and complimentary ceremonial treats.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "2rem" }}>
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="card"
            style={{
              padding: "2.25rem 2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top discount pill */}
            <div style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "linear-gradient(135deg, var(--color-paprika), #6b1406)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.8rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "var(--radius-pill)",
              boxShadow: "0 4px 12px rgba(143, 42, 21, 0.3)",
              letterSpacing: "0.5px"
            }}>
              {offer.discount}
            </div>

            <div>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--color-turmeric)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: "block"
              }}>
                {offer.badge}
              </span>

              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginTop: "0.4rem",
                marginBottom: "0.25rem",
                color: "var(--text-main)",
                lineHeight: "1.25"
              }}>
                {offer.title}
              </h2>

              <span style={{
                fontSize: "0.95rem",
                color: "var(--color-paprika)",
                fontWeight: 600,
                display: "block",
                marginBottom: "1rem"
              }}>
                {offer.amharic}
              </span>

              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                lineHeight: "1.65",
                marginBottom: "1.75rem"
              }}>
                {offer.description}
              </p>
            </div>

            <div style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1.25rem",
              marginTop: "auto"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "1rem"
              }}>
                <div>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--color-paprika)"
                  }}>
                    {offer.price} {offer.price !== "FREE" && <small style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ETB</small>}
                  </span>{" "}
                  {offer.regularPrice && (
                    <span style={{
                      textDecoration: "line-through",
                      color: "var(--text-dim)",
                      fontSize: "0.92rem",
                      marginLeft: "0.35rem"
                    }}>
                      {offer.regularPrice}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Code: <code style={{
                    color: "var(--color-paprika-dark)",
                    background: "var(--bg-surface-sand)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ebd9ca",
                    fontWeight: 700,
                    fontFamily: "monospace"
                  }}>{offer.code}</code>
                </div>
              </div>

              <div style={{
                fontSize: "0.82rem",
                color: "var(--text-dim)",
                marginBottom: "1.35rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                <span>⏰</span> <span>{offer.validUntil}</span>
              </div>

              <Link
                href={`/checkout?dishId=${offer.dishId}`}
                className="btn-figma btn-figma--primary"
                style={{ width: "100%" }}
              >
                Claim Special Feast &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
