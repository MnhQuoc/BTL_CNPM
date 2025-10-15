import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { FaEye } from 'react-icons/fa';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy query param search từ URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  // Hàm chuẩn hóa chuỗi (bỏ dấu, đổi về chữ thường)
  const normalizeString = (str) => {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('http://localhost:3001/courses');
        let data = res.data;

        // Nếu có search → lọc theo name
        if (searchQuery) {
          const normalizedSearch = normalizeString(searchQuery);
          data = data.filter((food) =>
            normalizeString(food.name).includes(normalizedSearch)
          );
        }

        setFoods(data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchFoods();
  }, [searchQuery]); // ✅ chạy lại khi searchQuery thay đổi

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Menu món ăn</h2>

      <div className="row">
        {foods.map((food) => (
          <div className="col-md-4 mb-4" key={food.id}>
            <div className="card h-100">
              <img
                src={food.image || 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={food.name}
              />
              <div className="card-body">
                <h5 className="card-title">{food.name}</h5>
                <p className="card-text">{food.note}</p>
                <p className="card-text">
                  <strong>Giá:</strong> {food.price}đ <br />
                  <strong>Giá KM:</strong> {food.discountPrice}đ <br />
                  <strong>Phí DV:</strong> {food.serviceFee}đ
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/courses/${food.id}`)}
                  >
                    <FaEye /> Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {foods.length === 0 && (
          <div className="text-center mt-4 text-muted">Không tìm thấy món ăn nào.</div>
        )}
      </div>
    </div>
  );
};

export default Menu;
