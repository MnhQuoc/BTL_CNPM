import React from 'react';
import './Footer.css';
import { FaFacebook } from 'react-icons/fa';
import {
  FaSquareGooglePlus,
  FaSquareInstagram,
  FaSquareXTwitter,
} from 'react-icons/fa6';

const Footer = () => {

  const founders = [
    {
      name: '1',
      img: '/images/avt1.jpg',
    },
    {
      name: '2',
      img: '/images/avt2.jpg',
    },
    {
      name: '3',
      img: '/images/avt3.jpg',
    },
    {
      name: '4',
      img: '/images/avt4.jpg',
    },
    {
      name: '5',
      img: '/images/avt5.jpg',
    },
    {
      name: '6',
      img: '/images/avt6.jpg',
    },
    {
      name: '7',
      img: '/images/avt7.jpg',
    },
    { 
      name: '8',
      img: '/images/avt8.jpg',
    },
  ];
  return (
    <>
      <footer className="footer-section bg-dark text-light py-5">
        <div className="container">
          <div className="row text-left">
            {/* Column 1 */}
            <div className="col-md-3 mb-4">
              <h6 className="footer-title">Khám phá</h6>
              <ul className="list-unstyled">
                <li><a href="#">Ứng dụng Mobile</a></li>
                <li><a href="#">Tạo bộ sưu tập</a></li>
                <li><a href="#">Bảo mật thông tin</a></li>
                <li><a href="#">Quy định</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="col-md-3 mb-4">
              <h6 className="footer-title">HCMUT</h6>
              <ul className="list-unstyled">
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Trợ giúp</a></li>
                <li><a>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</a></li>
                <li><a>Liên hệ: 0123456789</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-md-3 mb-4">
              <h6 className="footer-title">Tham gia trên</h6>
              <ul className="list-unstyled">
                <li><a href="https://www.facebook.com/"><FaFacebook className="me-2" />Facebook</a></li>
                <li><a href="https://www.instagram.com/"><FaSquareInstagram className="me-2" />Instagram</a></li>
                <li><a href="https://www.google.com/"><FaSquareGooglePlus className="me-2" />Google</a></li>
                <li><a href="https://www.twitter.com/"><FaSquareXTwitter className="me-2" />Twitter</a></li>
              </ul>
            </div>

            {/* Column 4 - Founders */}
            <div className="col-md-3 mb-4">
              <h6 className="footer-title">BTL CNPM - Nhóm 5</h6>
              <div className="row founders-grid">
                {founders.map((person, index) => (
                    <div key={index} className="col-3 mb-2 text-center">
                      <img
                          src={person.img}
                          alt={person.name}
                          className="rounded-circle shadow founder-img"
                          style={{ objectFit: 'cover' }}
                      />
                      <div className="mt-2">
                        <strong>{person.name}</strong>
                        <p className="mb-0 small text-muted">{person.role}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center small">
            <span>© 2025 BTL CNPM - Nhóm 5</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
