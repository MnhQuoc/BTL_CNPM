import React, { useEffect, useRef, useState } from 'react';
import './About.css';
import axios from 'axios';
import MainContent from '../Content/MainContent';
import { useNavigate } from 'react-router'; // ✅ thêm
import { useCart } from '../../contexts/CartContext';

const About = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // ✅ thêm
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:3001/courses')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi fetch courses:', err));
  }, []);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });

  return (
    <>
      <div className="flash-sale-section">
        <div className="flash-sale-header">
          <h2>Các khóa học nổi bật</h2>
          <a href="#" className="view-all">Xem tất cả &gt;</a>
        </div>

        <div className="scroll-container">
          <button className="scroll-btn left" onClick={scrollLeft}>❮</button>
          <div className="product-list" ref={scrollRef}>
            {products.map(product => (
              <div 
                className="product-card" 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-wrap">
                  <img src={product.image} alt={product.name} />
                </div>
                <p className="product-name">{product.name}</p>
                <p className="price">{product.price.toLocaleString()}₫</p>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={scrollRight}>❯</button>
        </div>
      </div>

      <MainContent />

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <p>
              <strong>Nhà hàng:</strong> {selectedProduct.restname || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedProduct.address || "Chưa có"}
            </p>
            <p>
              <strong>Điện thoại:</strong> {selectedProduct.phone || "Chưa có"}
            </p>
            <p>
              <strong>Giá:</strong> {selectedProduct.price?.toLocaleString?.() || selectedProduct.price}₫
            </p>
            <p>
              <strong>Giờ mở cửa:</strong> {selectedProduct.openTime || "Chưa rõ"}{" "}
              <span className="open-status">{selectedProduct.status || "OPEN"}</span>
            </p>
            <p>{selectedProduct.description || "Không có mô tả."}</p>
            <div className="modal-buttons">
              <button  className="close-button"
                onClick={(e) => { e.stopPropagation(); addToCart(selectedProduct); alert('Đã thêm vào giỏ hàng!'); setSelectedProduct(null); }}>
                Đặt hàng
              </button>
              <button onClick={() => setSelectedProduct(null)} className="close-button">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default About;
