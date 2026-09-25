import React, { useState, useEffect } from 'react';
import { FiStar, FiCheckCircle, FiEdit3, FiX, FiThumbsUp, FiAward, FiAlertCircle } from 'react-icons/fi';
import { GiRoundStar } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { reviewSchema } from '../utils/validationSchemas';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Chef Marcus Samuelsson',
    role: 'Celebrity Chef & Culinary Author',
    avatar: '👨‍🍳',
    rating: 5,
    date: '2 weeks ago',
    tag: 'Press Feature',
    press: 'Food & Wine Magazine',
    content: 'Mesob House serves hands down the most authentic Doro Wat outside of Addis Ababa. The teff injera ferment is sublime, light, airy with the exact perfect sour notes. A masterpiece of Habesha culinary tradition.',
    likes: 142
  },
  {
    id: 2,
    author: 'Bethlehem Tsegaye',
    role: 'Verified Local Diner',
    avatar: '👩🏾',
    rating: 5,
    date: '1 month ago',
    tag: 'Verified Feast Guest',
    content: 'Brought my family here for a special celebration dinner. The Special Beyaynetu combination platter on the hand-woven mesob was huge and delicious! The Buna coffee ceremony with frankincense was the highlight of our evening.',
    likes: 89
  },
  {
    id: 3,
    author: 'Dr. Aaron Vance',
    role: 'Food & Travel Critic',
    avatar: '👨🏼‍💻',
    rating: 5,
    date: '3 weeks ago',
    tag: 'Eater Guide 2026',
    press: 'The Culinary Chronicle',
    content: 'The Kitfo Special here melts in your mouth. Prepared with freshly clarified niter kibbeh and authentic korarima spice. Absolutely top tier atmosphere, warm hospitality, and unbelievable flavors.',
    likes: 64
  },
  {
    id: 4,
    author: 'Hannah Robertson',
    role: 'Vegan Food Blogger',
    avatar: '🌱',
    rating: 5,
    date: '5 days ago',
    tag: 'Vegan Champion',
    content: 'As a vegan, finding rich, flavorful food can be tough. The Tsom (fasting) platters with Misir Wat, Kik Alicha, and Gomen were out of this world! 10/10 recommend for plant-based foodies.',
    likes: 112
  }
];

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'press' | '5star'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const { showToast } = useCart();

  // Form State
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds([...likedIds, id]);
    setReviewsList(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setFieldErrors({});

    const formData = { author, rating: Number(rating), comment };
    const result = reviewSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0]] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    const newRev = {
      id: Date.now(),
      author: formData.author,
      role: 'Verified Diner',
      avatar: '🌟',
      rating: formData.rating,
      date: 'Just now',
      tag: 'New Community Review',
      content: formData.comment,
      likes: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsModalOpen(false);
    setAuthor('');
    setComment('');
    setRating(5);
    setFieldErrors({});
    showToast('Thank you! Your review has been published with warmth.');
  };

  const filteredReviews = reviewsList.filter(r => {
    if (activeFilter === 'press') return r.press || r.tag.includes('Press') || r.tag.includes('Eater');
    if (activeFilter === '5star') return r.rating === 5;
    return true;
  });

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="badge-pill">
            <GiRoundStar className="badge-icon" />
            <span>5-Star Hospitality & Cuisine</span>
          </div>
          <h2 className="section-title">Loved by Foodies & Critics</h2>
          <p className="section-subtitle">
            See what food critics, top chefs, and our cherished guests say about their Mesob House experience.
          </p>
        </div>

        {/* Rating Metrics Bar */}
        <div className="rating-metrics-card">
          <div className="metric-score-box">
            <span className="big-score">4.9</span>
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-filled" />
              ))}
            </div>
            <span className="score-label">Based on 1,480+ Reviews</span>
          </div>
          <div className="metric-badges-row">
            <div className="metric-badge">
              <FiAward className="metric-badge-icon" />
              <div>
                <strong>#1 Ethiopian Restaurant</strong>
                <small>Culinary Excellence Award 2026</small>
              </div>
            </div>
            <div className="metric-badge">
              <FiCheckCircle className="metric-badge-icon" />
              <div>
                <strong>100% Ancient Teff</strong>
                <small>Authentic Gluten-Free Ferment</small>
              </div>
            </div>
          </div>
          <button 
            className="btn-accent review-submit-trigger"
            onClick={() => setIsModalOpen(true)}
          >
            <FiEdit3 /> Write a Review (አስተያየት ይፃፉ)
          </button>
        </div>

        {/* Filter Pills */}
        <div className="reviews-filter-bar">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'press' ? 'active' : ''}`}
            onClick={() => setActiveFilter('press')}
          >
            🏆 Press & Critic Highlights
          </button>
          <button 
            className={`filter-btn ${activeFilter === '5star' ? 'active' : ''}`}
            onClick={() => setActiveFilter('5star')}
          >
            ⭐ 5-Star Guests
          </button>
        </div>

        {/* Grid of Reviews */}
        <div className="reviews-grid">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className={`review-card ${rev.press ? 'press-highlight' : ''}`}>
              <div className="review-card-top">
                <div className="reviewer-info">
                  <span className="reviewer-avatar">{rev.avatar}</span>
                  <div>
                    <h4 className="reviewer-name">{rev.author}</h4>
                    <span className="reviewer-role">{rev.role}</span>
                  </div>
                </div>
                <span className="review-tag-badge">{rev.tag}</span>
              </div>

              <div className="review-stars-row">
                {[...Array(rev.rating)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
                <span className="review-date">{rev.date}</span>
              </div>

              <p className="review-content">"{rev.content}"</p>

              {rev.press && (
                <div className="press-citation">
                  <span>As featured in <strong>{rev.press}</strong></span>
                </div>
              )}

              <div className="review-footer">
                <button 
                  className={`like-btn ${likedIds.includes(rev.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(rev.id)}
                >
                  <FiThumbsUp /> Helpful ({rev.likes})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-card review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <FiX />
            </button>
            <h3 className="modal-title">Share Your Mesob Experience</h3>
            <p className="modal-subtitle">Your story helps us keep the hearth burning bright.</p>

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Your Name / Handle *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Samuel K." 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                {fieldErrors.author && (
                  <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.author}</span>
                )}
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-input-btn ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      <FiStar />
                    </button>
                  ))}
                  <span className="rating-num-label">{rating} Out of 5 Stars</span>
                </div>
                {fieldErrors.rating && (
                  <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.rating}</span>
                )}
              </div>

              <div className="form-group">
                <label>Your Review / Experience *</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the dishes, service, Buna coffee ceremony, or ambiance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                {fieldErrors.comment && (
                  <span className="field-error-msg"><FiAlertCircle /> {fieldErrors.comment}</span>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Review (አስገባ)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
