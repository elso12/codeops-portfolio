import React, { useState } from 'react';
import { FiChevronDown, FiHelpCircle, FiSearch } from 'react-icons/fi';

const FAQS_DATA = [
  {
    category: 'dietary',
    q: 'Is your Injera 100% gluten-free Teff?',
    a: 'Yes! Our signature injera is stone-ground from 100% ancient pure teff grain fermented naturally over 3 days. It is naturally gluten-free, low GI, and packed with iron and mineral goodness.'
  },
  {
    category: 'dietary',
    q: 'Do you offer vegan and vegetarian options (Tsom / fasting)?',
    a: 'Extensively! Ethiopian culinary tradition has over 200 days of traditional fasting (Tsom) per year. Our plant-based options include Misir Wat (spiced lentils), Kik Alicha (yellow split peas), Gomen (collard greens), Shiro Wot, and communal Veggie Combination platters.'
  },
  {
    category: 'dining',
    q: 'What is the daily Buna Coffee Ceremony timing?',
    a: 'Our traditional Buna ceremony takes place daily at 4:00 PM in our courtyard lounge. Raw green Ethiopian Yirgacheffe beans are hand-roasted over hot coals, ground in a mortar, and brewed three times in a traditional clay jebena accompanied by frankincense and popcorn.'
  },
  {
    category: 'dining',
    q: 'What does "Gursha" mean when dining at Mesob House?',
    a: 'Gursha (ጉርሻ) is the traditional Habesha act of friendship and love where dining companions feed a wrapped morsel of food directly into each other’s mouths during a shared feast. It signifies trust, unity, and warm hospitality.'
  },
  {
    category: 'orders',
    q: 'How does delivery and takeaway packaging work?',
    a: 'All delivery and takeaway orders are packed in eco-friendly insulated woven-texture thermal containers. Warm wats and freshly rolled injera are kept separate to ensure your feast arrives hot and fresh.'
  },
  {
    category: 'orders',
    q: 'Can I reserve a private Mesob table for large parties?',
    a: 'Absolutely! We offer traditional VIP Mesob seating for parties from 2 to 24 guests. You can book directly using our online "Book Mesob" button or call our banquet desk.'
  }
];

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'dietary' | 'dining' | 'orders'
  const [openIndex, setOpenIndex] = useState(0); // Open first FAQ by default
  const [faqSearch, setFaqSearch] = useState('');

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQS_DATA.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          item.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header-center">
          <div className="badge-pill">
            <FiHelpCircle className="badge-icon" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our teff injera, Buna ceremony, dietary options, and traditional dining customs.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="faq-controls-bar">
          <div className="faq-search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search questions (e.g., teff, vegan, Buna, delivery)..." 
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
          </div>

          <div className="faq-cat-tabs">
            <button 
              className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </button>
            <button 
              className={`cat-tab ${activeCategory === 'dietary' ? 'active' : ''}`}
              onClick={() => setActiveCategory('dietary')}
            >
              🌱 Teff & Dietary
            </button>
            <button 
              className={`cat-tab ${activeCategory === 'dining' ? 'active' : ''}`}
              onClick={() => setActiveCategory('dining')}
            >
              ☕ Culture & Ceremony
            </button>
            <button 
              className={`cat-tab ${activeCategory === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveCategory('orders')}
            >
              📦 Ordering & Booking
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="faq-accordion-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                    <span className="question-text">{faq.q}</span>
                    <FiChevronDown className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="faq-empty-state">
              <p>No questions found matching "{faqSearch}". Please contact our host directly below!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
