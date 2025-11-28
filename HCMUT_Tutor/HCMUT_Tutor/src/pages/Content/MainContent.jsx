import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MainContent.css";
import axios from "axios";

// Accepts optional onSelectProduct(product) prop. If provided the parent
// can show a modal; otherwise MainContent will navigate to the detail page.
const MainContent = ({ onSelectProduct }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "";

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/testimonials')
      .then(res => setTestimonials(res.data))
      .catch(err => console.error('Lỗi khi fetch testimonials:', err));
  }, []);

  return (
    <>
      <h2 className="deal-title">{title}</h2>
      <div className="testimonials-section">
        <div className="testimonials-header">
          <h3 className="section-subtitle">TESTIMONIALS</h3>
          <h2 className="section-title">Student Reviews</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.id}>
              <h3 className="testimonial-title">{t.title}</h3>
              <div className="testimonial-rating">{Array.from({length:5}).map((_,i)=> (
                <span key={i} className={`star ${i < t.rating ? 'filled' : ''}`}>★</span>
              ))}</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="author-avatar" />
                <div className="author-info">
                  <div className="author-name">{t.name}</div>
                  <div className="author-status">{t.semester}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainContent;
