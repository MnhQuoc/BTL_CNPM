import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FoodEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/courses/${id}`);
        setFood({
          ...res.data,
          tag: res.data.tag?.join(', '),
        });
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchFood();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFood((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = 'dr1ihrvvg';
    const UPLOAD_PRESET = 'TruaNayAnGi';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Upload thất bại');
    }
    return data.secure_url;
  };

  const handleSave = async () => {
    try {
      let imageUrl = food.image;
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      const updatedFood = {
        ...food,
        image: imageUrl,
        prepareTime: parseInt(food.prepareTime) || 0,
        serviceFee: parseFloat(food.serviceFee) || 0,
        tag: food.tag.split(',').map(t => t.trim()),
      };

      await axios.put(`http://localhost:3001/courses/${id}`, updatedFood);
      setMessage(<><FaCheckCircle className="me-2" /> Cập nhật thành công!</>);
      setIsSuccess(true);
      setTimeout(() => navigate('/listfood'), 1500);
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      setMessage(<><FaTimesCircle className="me-2" /> Cập nhật thất bại!</>);
      setIsSuccess(false);
    }

    setTimeout(() => setMessage(''), 4000);
  };

  if (!food) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Chỉnh sửa món ăn</h2>

      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>{message}</div>
      )}
<div className="mb-3">
        <label className="form-label">Tên món ăn</label>
        <input id="name" value={food.name} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Địa chỉ</label>
        <input id="address" value={food.address} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Ảnh món ăn</label>
        {image ? (
          <div>
            <img src={URL.createObjectURL(image)} style={{ maxWidth: 200 }} alt="preview" />
          </div>
        ) : food.image && (
          <div>
            <img src={food.image} style={{ maxWidth: 200 }} alt="current" />
          </div>
        )}
        <input type="file" onChange={handleImageChange} className="form-control mt-2" />
      </div>

      <div className="mb-3">
        <label className="form-label">Thời gian chuẩn bị</label>
        <input id="prepareTime" value={food.prepareTime} onChange={handleChange} className="form-control" type="number" />
      </div>


      <div className="mb-3">
        <label className="form-label">Phí dịch vụ</label>
        <input id="serviceFee" value={food.serviceFee} onChange={handleChange} className="form-control" type="number" />
      </div>

      <div className="mb-3">
        <label className="form-label">Ghi chú</label>
        <textarea id="note" value={food.note} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Tags (cách nhau bởi dấu phẩy)</label>
        <input id="tag" value={food.tag} onChange={handleChange} className="form-control" />
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-success" onClick={handleSave}>
          <FaSave className="me-2" /> Lưu
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/listfood')}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>
      </div>
    </div>
  );
};

export default FoodEdit;