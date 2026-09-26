import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: '',
      rating: 5,
      comment: ''
    }
  });

  const ratingValue = watch('rating', 5);

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

  const onValidReviewSubmit = (data) => {
    const newRev = {
      id: Date.now(),
      author: data.author,
      role: 'Verified Diner',
      avatar: '🌟',
      rating: Number(data.rating),
      date: 'Just now',
      tag: 'New Community Review',
      content: data.comment,
      likes: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsModalOpen(false);
    reset();
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
            <span className="rating-subtitle">Based on 1,480+ Global Reviews</span>
          </div>

          <div className="metric-divider"></div>

          <div className="metric-badges">
            <div className="metric-badge-item">
              <FiAward className="metric-icon" />
              <div>
                <strong>Best Ethiopian Restaurant 2026</strong>
                <span>Culinary Excellence Awards</span>
              </div>
            </div>
            <div className="metric-badge-item">
              <FiCheckCircle className="metric-icon" />
              <div>
                <strong>99.4% Verified Satisfaction</strong>
                <span>Dine-In & Delivery Guests</span>
              </div>
            </div>
          </div>

          <button className="btn-primary write-review-btn" onClick={() => setIsModalOpen(true)}>
            <FiEdit3 /> Write a Guest Review
          </button>
        </div>

        {/* Filter Bar */}
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
            Press & Critics
          </button>
          <button 
            className={`filter-btn ${activeFilter === '5star' ? 'active' : ''}`}
            onClick={() => setActiveFilter('5star')}
          >
            5-Star Guest Reviews
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-grid">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-card-header">
                <div className="author-avatar-box">
                  <span className="avatar-emoji">{rev.avatar}</span>
                </div>
                <div className="author-details">
                  <h4 className="author-name">{rev.author}</h4>
                  <span className="author-role">{rev.role}</span>
                  {rev.press && <span className="press-name">📰 {rev.press}</span>}
                </div>
                <span className="review-date">{rev.date}</span>
              </div>

              <div className="review-rating-row">
                <div className="stars-row small">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < rev.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <span className="review-tag">{rev.tag}</span>
              </div>

              <p className="review-content">"{rev.content}"</p>

              <div className="review-card-footer">
                <button 
                  className={`like-btn ${likedIds.includes(rev.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(rev.id)}
                >
                  <FiThumbsUp /> {rev.likes} Helpful
                </button>
                <span className="verified-badge">
                  <FiCheckCircle /> Verified Guest
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <FiX />
            </button>

            <h3 className="modal-title">Share Your Mesob Experience</h3>
            <p className="modal-subtitle">Your story helps us keep the hearth burning bright.</p>

            <form onSubmit={handleSubmit(onValidReviewSubmit)} className="review-form" noValidate>
              <div className="form-group">
                <label>Your Name / Handle *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Samuel K." 
                  {...register('author')}
                />
                {errors.author && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.author.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-input-btn ${star <= ratingValue ? 'active' : ''}`}
                      onClick={() => setValue('rating', star, { shouldValidate: true })}
                    >
                      <FiStar />
                    </button>
                  ))}
                  <span className="rating-num-label">{ratingValue} Out of 5 Stars</span>
                </div>
                {errors.rating && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.rating.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Your Review / Experience *</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the dishes, service, Buna coffee ceremony, or ambiance..."
                  {...register('comment')}
                ></textarea>
                {errors.comment && (
                  <span className="field-error-msg"><FiAlertCircle /> {errors.comment.message}</span>
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
