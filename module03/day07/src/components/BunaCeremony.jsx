import React from 'react';
import { useCart } from '../context/CartContext';
import { FiClock, FiCalendar, FiHeart } from 'react-icons/fi';
import { GiCoffeePot, GiIncense } from 'react-icons/gi';

export default function BunaCeremony() {
  const { openReservation } = useCart();

  const rounds = [
    {
      name: 'Abol',
      amharic: 'አቦል',
      round: 'Round 1',
      desc: 'The initial extraction. Deep, intense, and unfiltered essence of fresh-roasted Yirgacheffe coffee beans.'
    },
    {
      name: 'Tona',
      amharic: 'ቶና',
      round: 'Round 2',
      desc: 'Water is added to the clay Jebena for a smoother, balanced second brew as conversations deepen.'
    },
    {
      name: 'Baraka',
      amharic: 'በረካ',
      round: 'Round 3 (Blessing)',
      desc: 'The concluding round representing spiritual grace and fellowship, accompanied by fresh roasted popcorn.'
    }
  ];

  return (
    <section className="buna-section" id="buna-ceremony">
      <div className="container">
        <div className="buna-grid">
          {/* Left Text & Cultural Narrative */}
          <div className="buna-content">
            <div className="badge-hearth">
              <GiCoffeePot />
              <span>SACRED HABESHA RITUAL</span>
            </div>
            <h2 className="section-title">
              The Traditional <span className="title-highlight">Buna Ceremony</span>
            </h2>
            <span className="section-amharic amharic-text">የጀበና ቡና እና ዕጣን ሥነ-ሥርዓት</span>

            <p className="buna-lead">
              In Ethiopian culture, coffee is not just a drink — it is an hour-long ceremony of hospitality, spiritual connection, and communal storytelling.
            </p>
            <p className="buna-description">
              At Mesob House, green Arabica beans are hand-washed, roasted over glowing embers in an earthenware pan, passed around so guests can inhale the sacred aroma, and brewed to perfection inside a long-necked black clay <em>Jebena</em>.
            </p>

            {/* Time badge */}
            <div className="ceremony-schedule-card">
              <div className="schedule-time-box">
                <FiClock className="schedule-clock" />
                <div>
                  <strong>Daily Ceremony: 4:00 PM</strong>
                  <span>Open to all dinner guests with complimentary popped corn</span>
                </div>
              </div>
              <button className="btn-primary" onClick={openReservation}>
                <FiCalendar />
                <span>Join Today's Circle</span>
              </button>
            </div>
          </div>

          {/* Right: The 3 Rounds Card */}
          <div className="buna-rounds-card">
            <div className="rounds-header">
              <GiIncense className="incense-icon" />
              <div>
                <h3>The Three Sacred Cups</h3>
                <span>ከአቦል እስከ በረካ</span>
              </div>
            </div>

            <div className="rounds-list">
              {rounds.map((r, i) => (
                <div key={i} className="round-item">
                  <div className="round-number-badge">{i + 1}</div>
                  <div className="round-details">
                    <div className="round-title-row">
                      <h4>{r.name}</h4>
                      <span className="round-amharic amharic-text">{r.amharic}</span>
                      <span className="round-tag">{r.round}</span>
                    </div>
                    <p>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="buna-quote">
              <FiHeart className="quote-heart" />
              <span>“Buna dabo naw” — Coffee is our bread, our bond, and our community.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
